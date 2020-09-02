import StateManager from "./state-manager";
import { Subject, interval } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { IncrementTick, EndGame, RotateActiveAndNextShapes, MoveActiveShape } from "./store/actions";
import { GameStatus } from "../models/game-status";
import { Shape } from "../models/shape";
import { ShapeType } from "../models/shape-type";
import { Grid } from "../models/grid";
import { MoveDirection } from "../models/move-direction";
import { Cell } from "../models/cell";

export class GameEngine {
  private stopEngine$ = new Subject();
  private gameState: any;
  
  constructor(private stateManager: StateManager) {
    this.stateManager.selectGameState(gameState => {
      return {
        gameStatus: gameState.gameStatus,
        level: gameState.level
      };
    })
    .subscribe((engineData) => {
      this.stopEngine();
      this.setEngineState(engineData.gameStatus, engineData.level);
    });

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
    console.log(`Tick: ${tickCount}`);
    const activeShape: Shape = this.gameState.grid.activeShape;

    if (activeShape && activeShape.canMove(MoveDirection.Down)) {
      const nextCells = activeShape.getNextMoveCells(MoveDirection.Down);
      this.stateManager.dispatch(new MoveActiveShape(nextCells));
    } else {
      if (this.canGenerateNextShape()) {
        const newNextShape = this.generateRandomShape();
        console.log('newNextShape', newNextShape);
        this.stateManager.dispatch(new RotateActiveAndNextShapes(newNextShape));
      } else {
        this.stateManager.dispatch(new EndGame());
      }
    }
  }

  private canGenerateNextShape(): boolean {
    return true;
  }

  private generateRandomShape(): Shape {
    const grid: Grid = this.gameState.grid;
    const shapeType = this.getRandomShapeType();
    const cells = this.getCellsForShape(shapeType, grid);

    return new Shape(cells, shapeType, grid);
  }

  getCellsForShape(shapeType: ShapeType, grid: Grid): Cell[] {
    return [];
  }

  private getRandomShapeType(): ShapeType {
    const enumValues = Object.keys(ShapeType);
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    return enumValues[randomIndex] as ShapeType;
  }

  private runEngine(gameLevel: number): void {
    this.stopEngine$ = new Subject();

    interval(this.calculateTickInterval(gameLevel))
      .pipe(takeUntil(this.stopEngine$))
      .subscribe(() => this.stateManager.dispatch(new IncrementTick()));
  }

  private calculateTickInterval(gameLevel: number): number {
    return 300 * gameLevel;
  }

  private stopEngine(): void {
    this.stopEngine$.next();
    this.stopEngine$.complete();
  }

  private setEngineState(gameStatus: GameStatus, level: number): void {
    switch(gameStatus) {
      case GameStatus.Start:
      case GameStatus.Paused:
      case GameStatus.End:
        this.stopEngine();
        break;
      case GameStatus.Playing:
        this.runEngine(level);
        break;
    }
  }
}