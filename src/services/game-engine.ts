import StateManager from "./state-manager";
import { Subject, interval } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { IncrementTick } from "./store/actions";
import { GameStatus } from "../models/game-status";
import { GameState } from "./store/game-state";

export class GameEngine {
  private stopEngine$ = new Subject();
  
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
        activeShape: gameState.grid.activeShape
      };
    })

    this.stateManager.selectGameState(gameState => gameState.tickCount)
      .subscribe((tickCount: number) => this.tickGame(tickCount))
  }

  private tickGame(tickCount: number): void {
    console.log(`Tick: ${tickCount}`);
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