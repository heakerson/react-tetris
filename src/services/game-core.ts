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

export class GameCore {
  private gameState: any;
  
  constructor(private stateManager: StateManager, private shapeManager: ShapeConfigManager) {
    this.stateManager.selectGameState(gameState => {
      return {
        grid: gameState.grid,
        nextShape: gameState.nextShape
      }
    })
      .subscribe(gameState => this.gameState = gameState);

    this.stateManager.selectGameState(gameState => gameState.tickCount)
      .subscribe((tickCount: number) => this.tickGame(tickCount))
  }

  private tickGame(tickCount: number): void {
    const grid: Grid = this.gameState.grid;
    const activeShape: Shape = grid.activeShape as Shape;
    const nextStep: TickStep = this.determineNextStep(grid);
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
    // console.log('newNextShape', newNextShape);
    this.stateManager.dispatch(new RotateActiveAndNextShapes(cellsToPlaceNewActiveShape, newNextShape));
  }

  private determineNextStep(grid: Grid): TickStep {
    const activeShape: Shape = grid.activeShape as Shape;

    if (this.activeShapePositionInvalid(grid)) {
      return TickStep.EndGame;
    }
    else if (!activeShape) {
      return TickStep.InitActiveAndNextShape;
    }
    else if (activeShape && activeShape.getNextMoveCells(MoveDirection.Down, grid).length > 0) {
      return TickStep.MoveActiveShapeDown;
    } else {
      return TickStep.SwapNextAndActiveShapes;
    }
  }

  public generateRandomShape(): Shape {
    const shapeType = this.getRandomShapeType();
    const rotation = this.getRandomShapeRotation();
    return new Shape([], shapeType, rotation);
  }

  public getCellsToPlaceNextShape(shapeType: ShapeType, rotationDirection: RotationPoint, grid: Grid): Cell[] {
    const shapeConfig = this.shapeManager.getConfigFor(shapeType, rotationDirection);
    const potentionStartPoints: number[] = this.getPotentionStartColumnsFor(shapeConfig, grid);

    let randomColumnPosition = -1;
    let position: Cell[] = [];
    let foundValidPosition = false;
    while (potentionStartPoints.length > 0 && !foundValidPosition) {
      randomColumnPosition = Math.floor(Math.random() * Math.floor(potentionStartPoints.length));
      const cell = grid.getCell(grid.height-1, randomColumnPosition);
      position = shapeConfig.getPositionGivenRectangleCorner(cell, grid);
      if (this.positionValid(position, grid)) {
        foundValidPosition = true;
      }
    }
    return position;
  }

  private positionValid(cells: Cell[], grid: Grid): boolean {
    return true; // TODO
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
    return false;
  }
}