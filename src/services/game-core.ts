import { Shape } from "../models/shape";
import { Grid } from "../models/grid";
import { ShapeType } from "../models/shape-type";
import { Cell } from "../models/cell";
import StateManager from "./state-manager";
import { EndGame, MoveActiveShape, RotateActiveAndNextShapes, InitActiveAndNextShape } from "./store/actions";
import { MoveDirection } from "../models/move-direction";
import { TickStep } from "../models/tick-step";
import { RotationPoint } from "../models/rotation-point";
import { ShapeConfigManager } from "./shape-config-manager";
import { ShapePositionConfig } from "../models/shape-position-config";
import { GameStatus } from "../models/game-status";
import _ from "lodash";

export class GameCore {
  private gameState: any;
  
  constructor(private stateManager: StateManager, private shapeManager: ShapeConfigManager) {
    this.stateManager.selectGameState(gameState => {
      return {
        grid: gameState.grid,
        nextShape: gameState.nextShape,
        gameStatus: gameState.gameStatus,
        activeCells: gameState.grid.activeShape?.cells
      }
    })
    .subscribe(gameState => this.gameState = gameState);

    this.stateManager.selectGameState(gameState => gameState.tickCount)
      .subscribe((tickCount: number) => this.tickGame(tickCount))
  }

  private tickGame(tickCount: number): void {
    const grid: Grid = this.gameState.grid;
    const activeShape: Shape = grid.activeShape as Shape;
    const nextStep: TickStep = this.determineNextStep(this.gameState.gameStatus, grid);
// console.log(`Tick: ${tickCount}, Next Step: ${nextStep}, grid:`, grid);

    switch(nextStep) {
      case TickStep.InitActiveAndNextShape:
        this.initActiveAndNextShape(grid);
        break;

      case TickStep.MoveActiveShapeDown:
        const nextCells = activeShape.getNextMoveCells(MoveDirection.Down, grid);
        this.stateManager.dispatch(new MoveActiveShape(nextCells));
        break;

      case TickStep.SwapNextAndActiveShapes:
        this.swapNextAndActiveShapes(grid);
        break;

      case TickStep.EndGame:
        this.stateManager.dispatch(new EndGame());
        break;
    }
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
    else if (this.canMoveShapeDown(activeShape, grid)) {
      return TickStep.MoveActiveShapeDown;
    } else {
      return TickStep.SwapNextAndActiveShapes;
    }
  }

  private canMoveShapeDown(activeShape: Shape, grid: Grid): boolean {
    if (activeShape) {
      const nextMoveCells = activeShape.getNextMoveCells(MoveDirection.Down, grid);

      if (nextMoveCells && nextMoveCells.length > 0) {
        return !this.positionOverlapsOtherShapes(nextMoveCells);
      }
    }

    return false;
  }

  public generateRandomShape(): Shape {
    const shapeType = this.getRandomShapeType();
    const rotation = this.getRandomShapeRotation();
    return new Shape([], shapeType, rotation);
  }

  public getCellsToPlaceNextShape(shapeType: ShapeType, rotationDirection: RotationPoint, grid: Grid): Cell[] {
    const shapeConfig = this.shapeManager.getConfigFor(shapeType, rotationDirection);
    const potentionStartPoints: number[] = this.getPotentionStartColumnsFor(shapeConfig, grid).sort(() => Math.random() - .5);
    let randomColumnPosition = -1;
    let position: Cell[] = [];
    let foundValidPosition = false;

    for (let i = 0; i < potentionStartPoints.length; i++) {
      randomColumnPosition = potentionStartPoints[i];
      const cell = this.gameState.grid.getCell(grid.height-1, randomColumnPosition);
      position = shapeConfig.getPositionGivenRectangleCorner(cell, this.gameState.grid);
      const overlap = this.positionOverlapsOtherShapes(position);

      if (!overlap) {
        foundValidPosition = true;
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

  public getRandomShapeType(): ShapeType {
    const enumValues = Object.keys(ShapeType);
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    return enumValues[randomIndex] as ShapeType;
  }

  public getRandomShapeRotation(): RotationPoint {
    const enumValues = Object.keys(RotationPoint);
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    return enumValues[randomIndex] as RotationPoint;
  }

  public activeShapePositionInvalid(grid: Grid): boolean {
    if (grid.activeShape) {
      return this.positionOverlapsOtherShapes(grid.activeShape.cells);
    }
    return false;
  }
}