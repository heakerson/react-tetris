import { Shape } from "../models/shape";
import { Grid } from "../models/grid";
import { ShapeType } from "../models/shape-type";
import { Cell } from "../models/cell";
import StateManager from "./state-manager";
import { EndGame, MoveActiveShape, RotateActiveAndNextShapes, InitActiveAndNextShape } from "./store/actions";
import { MoveDirection } from "../models/move-direction";
import { TickStep } from "../models/tick-step";
import { RotationPoint } from "../models/rotation-point";

export class GameCore {
  private gameState: any;
  
  constructor(private stateManager: StateManager) {
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
    console.log(`Tick: ${tickCount}, Next Step: ${nextStep}, grid:`, grid);
    switch(nextStep) {
      case TickStep.InitActiveAndNextShape:
        this.initActiveAndNextShape(grid);
        break;

      case TickStep.MoveActiveShapeDown:
        const nextCells = activeShape.getNextMoveCells(MoveDirection.Down);
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
    activeShape.cells = this.getCellsToPlaceNextShape(activeShape.shapeType, grid);

    this.stateManager.dispatch(new InitActiveAndNextShape(activeShape, nextShape));
  }

  private swapNextAndActiveShapes(grid: Grid): void {
    let nextShape: Shape = this.gameState.nextShape;
    const cellsToPlaceNewActiveShape = this.getCellsToPlaceNextShape(nextShape.shapeType, grid);
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
    else if (activeShape && activeShape.canMove(MoveDirection.Down)) {
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

  public getCellsToPlaceNextShape(shapeType: ShapeType, grid: Grid): Cell[] {
    return [];
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