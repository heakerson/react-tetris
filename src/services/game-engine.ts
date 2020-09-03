import StateManager from "./state-manager";
import { Subject, interval } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { IncrementTick } from "./store/actions";
import { GameStatus } from "../models/game-status";

export class GameEngine {
  private stopEngine$ = new Subject();
  
  constructor(private stateManager: StateManager) {
    this.stateManager.selectGameState(gameState => {
      return {
        gameStatus: gameState.gameStatus,
        level: gameState.level
      };
    })
    .subscribe((engineData) => this.setEngineState(engineData.gameStatus, engineData.level));
  }

  private setEngineState(gameStatus: GameStatus, level: number): void {
    this.stopEngine();

    if (gameStatus === GameStatus.Playing) {
      this.runEngine(level);
    }
  }

  private runEngine(gameLevel: number): void {
    this.stopEngine$ = new Subject();

    interval(this.calculateTickInterval(gameLevel))
      .pipe(takeUntil(this.stopEngine$))
      .subscribe(() => this.stateManager.dispatch(new IncrementTick()));
  }

  private stopEngine(): void {
    this.stopEngine$.next();
    this.stopEngine$.complete();
  }

  private calculateTickInterval(gameLevel: number): number {
    // TODO
    return 300 * gameLevel;
  }
}