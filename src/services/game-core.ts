import { Shape } from "../models/shape";
import { Grid } from "../models/grid";
import { ShapeType } from "../models/shape-type";
import { Cell } from "../models/cell";
import StateManager from "./state-manager";
import { EndGame, MoveActiveShape, RotateActiveAndNextShapes, InitActiveAndNextShape, ClearingRows, ClearActiveShape } from "./store/actions";
import { MoveDirection } from "../models/move-direction";
import { TickStep } from "../models/tick-step";
import { RotationPoint } from "../models/rotation-point";
import { ShapeConfigManager } from "./shape-config-manager";
import { ShapePositionConfig } from "../models/shape-position-config";
import { GameStatus } from "../models/game-status";
import { InputType } from "../models/input-type";
import { fromEvent, Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import { RotationDirection } from "../models/rotation-direction";

export class GameCore {
  private gameState: any;
  private takeUserInputUntil$ = new Subject();
  
  constructor(private stateManager: StateManager, private shapeManager: ShapeConfigManager) {
    this.stateManager.selectGameState(gameState => {
      return {
        grid: gameState.grid,
        nextShape: gameState.nextShape,
        gameStatus: gameState.gameStatus,
        activeCells: gameState.grid.activeShape?.cells,
        keyboardInputKeys: gameState.keyboardInputKeys
      }
    })
    .subscribe(gameState => this.gameState = gameState);

    this.stateManager.selectGameState(gameState => {
      return {
        inputType: gameState.inputType,
        grid: gameState.grid
      }
    })
      .subscribe(inputData => this.setUserInputEventListeners(inputData.inputType, inputData.grid));

    this.stateManager.selectGameState(gameState => gameState.tickCount)
      .subscribe((tickCount) => this.tickGame(tickCount))
  }

  private tickGame(tickCount: number): void {
    // console.log('TICK', tickCount);
    const grid: Grid = this.gameState.grid;
    const nextStep: TickStep = this.determineNextStep(this.gameState.gameStatus, grid);

    switch(nextStep) {
      case TickStep.InitActiveAndNextShape:
        this.initActiveAndNextShape(grid);
        break;

      case TickStep.MoveActiveShapeDown:
        this.shiftShape(MoveDirection.Down, grid);
        break;
    
      case TickStep.ClearRows:
        this.stateManager.dispatch(new ClearActiveShape());
        this.clearRows();
        break;

      case TickStep.SwapNextAndActiveShapes:
        this.swapNextAndActiveShapes(grid);
        break;

      case TickStep.EndGame:
        this.stateManager.dispatch(new EndGame());
        break;
    }
  }

  private determineNextStep(gameStatus: GameStatus, grid: Grid): TickStep {
    const activeShape: Shape = grid.activeShape as Shape;

    if (this.activeShapePositionInvalid(grid)) {
      return TickStep.EndGame;
    }
    else if (!activeShape && gameStatus === GameStatus.Start) {
      return TickStep.None;
    }
    else if (!activeShape) {
      return TickStep.InitActiveAndNextShape;
    }
    else if (this.canShiftShape(MoveDirection.Down, grid)) {
      return TickStep.MoveActiveShapeDown;
    }
    else if (grid.containsCompleteRow()) {
      return TickStep.ClearRows;
    }
    else {
      return TickStep.SwapNextAndActiveShapes;
    }
  }

  checkClearingRows(grid: Grid): void {
    if (grid.containsCompleteRow()){
      this.clearRows();
    }
  }

  clearRows(): void {
    this.stateManager.dispatch(new ClearingRows());
  }

  private initActiveAndNextShape(grid: Grid): void {
    const activeShape: Shape = this.generateRandomShape();
    const nextShape: Shape = this.generateRandomShape();
    activeShape.cells = this.getCellsToPlaceNextShape(activeShape.shapeType, activeShape.rotationPoint, grid);
    this.stateManager.dispatch(new InitActiveAndNextShape(activeShape, nextShape));
  }

  private swapNextAndActiveShapes(grid: Grid): void {
    let nextShape: Shape = this.gameState.nextShape;
    const cellsToPlaceNewActiveShape = this.getCellsToPlaceNextShape(nextShape.shapeType, nextShape.rotationPoint, grid);
    const newNextShape = this.generateRandomShape();
    this.stateManager.dispatch(new RotateActiveAndNextShapes(cellsToPlaceNewActiveShape, newNextShape));
  }

  private canShiftShape(direction: MoveDirection, grid: Grid): boolean {
    if (grid.activeShape) {
      const nextMoveCells = grid.activeShape.getNextMoveCells(direction, grid);
      const nextMoveCellsExist = nextMoveCells && nextMoveCells.length > 0 && (nextMoveCells.findIndex(c => !c) === -1);

      if (nextMoveCellsExist) {
        return !this.positionOverlapsOtherShapes(nextMoveCells);
      }
    }

    return false;
  }

  private canRotateShape(direction: RotationDirection, grid: Grid): boolean {
    const { activeShape } = grid;

    if (activeShape) {
      const shapeConfig = this.shapeManager.getConfigFor(activeShape.shapeType, activeShape.rotationPoint);
      const nextRotationPosition = shapeConfig.getRotatedPosition(activeShape, grid, direction);
      const nextRotationPositionExists = nextRotationPosition && nextRotationPosition.length > 0 && (nextRotationPosition.findIndex(c => !c) === -1);

      if (nextRotationPositionExists) {
        return !this.positionOverlapsOtherShapes(nextRotationPosition);
      }
    }

    return false;
  }

  private shiftShape(direction: MoveDirection, grid: Grid): void {
    const nextPosition = (grid as any).activeShape.getNextMoveCells(direction, grid);
    this.stateManager.dispatch(new MoveActiveShape(nextPosition));
  }

  private moveShapeToBottom(grid: Grid): void {
    if (this.gameState.gameStatus === GameStatus.Playing && !!grid && !!grid.activeShape) {
      const bottomPosition = this.getMoveShapeToBottomPosition(grid);
      this.stateManager.dispatch(new MoveActiveShape(bottomPosition));
      this.stateManager.dispatch(new ClearActiveShape());
      this.checkClearingRows(grid);
    }
  }

  private getMoveShapeToBottomPosition(grid: Grid): Cell[] {
    if (grid.activeShape) {
      const bottomCells = grid.activeShape.getBottomCells();

      const shiftDownValues = bottomCells.map(bottomShapeCell => {
        const topColumnCell = grid.getTopInactiveColumnPosition(bottomShapeCell.column);

        if (topColumnCell) {
          return bottomShapeCell.row - topColumnCell.row-1;
        } else {
          return bottomShapeCell.row;
        }
      });

      const smallestShift = shiftDownValues.sort()[0];
      return grid.activeShape.getNextMoveCells(MoveDirection.Down, grid, smallestShift);      
    }
    return [];
  }

  private rotateShape(direction: RotationDirection, grid: Grid): void {
    if (grid.activeShape) {
      const { shapeType, rotationPoint } = grid.activeShape;
      const shapeConfig = this.shapeManager.getConfigFor(shapeType, rotationPoint);
      const nextPosition = shapeConfig.getRotatedPosition(grid.activeShape, grid, direction);
      const nextRotationPoint = this.shapeManager.getNextRotationPoint(rotationPoint, direction);
      this.stateManager.dispatch(new MoveActiveShape(nextPosition, nextRotationPoint));
    }
  }

  private generateRandomShape(): Shape {
    const shapeType = this.getRandomShapeType();
    const rotation = this.getRandomShapeRotation();
    return new Shape([], shapeType, rotation);
  }

  private getCellsToPlaceNextShape(shapeType: ShapeType, rotationDirection: RotationPoint, grid: Grid): Cell[] {
    const shapeConfig = this.shapeManager.getConfigFor(shapeType, rotationDirection);
    const potentionStartPoints: number[] = this.getPotentionStartColumnsFor(shapeConfig, grid).sort(() => Math.random() - .5);
    let randomColumnPosition = -1;
    let position: Cell[] = [];

    for (let i = 0; i < potentionStartPoints.length; i++) {
      randomColumnPosition = potentionStartPoints[i];
      const cell = this.gameState.grid.getCell(grid.height-1, randomColumnPosition);
      position = shapeConfig.getPositionGivenRectangleCorner(cell, this.gameState.grid);
      const overlap = this.positionOverlapsOtherShapes(position);

      if (!overlap) {
        break;
      }
    }

    return position;
  }

  private positionOverlapsOtherShapes(cells: Cell[]): boolean {
    const foundOverlap = cells.find(cell => !!cell.inactiveShape);
    if (foundOverlap) {
      return true;
    } else {
      return false;
    }
  }

  private getPotentionStartColumnsFor(shapeConfig: ShapePositionConfig, grid: Grid): number[] {
    const shapeWidth = shapeConfig.width;
    const range = Array.from(Array(grid.width - shapeWidth + 1).keys())
    return range;
  }

  private getRandomShapeType(): ShapeType {
    const enumValues = Object.keys(ShapeType);
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    return enumValues[randomIndex] as ShapeType;
  }

  private getRandomShapeRotation(): RotationPoint {
    const enumValues = Object.keys(RotationPoint);
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    return enumValues[randomIndex] as RotationPoint;
  }

  private activeShapePositionInvalid(grid: Grid): boolean {
    if (grid.activeShape) {
      return this.positionOverlapsOtherShapes(grid.activeShape.cells);
    }
    return false;
  }

  private setUserInputEventListeners(inputType: InputType, grid: Grid): void {
    this.resetTakeUntilObservable();
    const keyboardKeys = this.gameState.keyboardInputKeys;

    if (inputType === InputType.Keyboard) {
      fromEvent(window, 'keydown')
        .pipe(
          takeUntil(this.takeUserInputUntil$),
          filter((event: any) => Object.values(keyboardKeys).includes(event.key))
        )
        .subscribe(event => {
    
          switch(event.key) {
            case keyboardKeys.downKey:
              if (this.canShiftShape(MoveDirection.Down, grid)) {
                this.shiftShape(MoveDirection.Down, grid);
              }
              break;
            case keyboardKeys.rotateClockwise:
              if (this.canRotateShape(RotationDirection.Clockwise, grid)) {
                this.rotateShape(RotationDirection.Clockwise, grid);
              }
              break;
            case keyboardKeys.rotateCounterClockwise:
              if (this.canRotateShape(RotationDirection.CounterClockwise, grid)) {
                this.rotateShape(RotationDirection.CounterClockwise, grid);
              }
              break;
            case keyboardKeys.leftKey:
              if (this.canShiftShape(MoveDirection.Left, grid)) {
                this.shiftShape(MoveDirection.Left, grid);
              }
              break;
            case keyboardKeys.rightKey:
              if (this.canShiftShape(MoveDirection.Right, grid)) {
                this.shiftShape(MoveDirection.Right, grid);
              }
              break;
            case keyboardKeys.moveToBottomKey:
              this.moveShapeToBottom(grid);
              break;
          }
        });
    } else {
      fromEvent(window, 'touchstart')
        .pipe(
          takeUntil(this.takeUserInputUntil$),
        )
        .subscribe((event: any) => {
          const midpoint = window.innerWidth / 2;
          const x = event.touches[0].clientX;
          const isLeft = x < midpoint;

          if (isLeft) {
            if (this.canShiftShape(MoveDirection.Left, grid)) {
              this.shiftShape(MoveDirection.Left, grid);
            }
          } else {
            if (this.canShiftShape(MoveDirection.Right, grid)) {
              this.shiftShape(MoveDirection.Right, grid);
            }
          }
        });
    }
  }

  private resetTakeUntilObservable(): void {
    this.takeUserInputUntil$.next();
    this.takeUserInputUntil$.complete();
    this.takeUserInputUntil$ = new Subject();
  }
}