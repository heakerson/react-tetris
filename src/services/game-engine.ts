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
        currentLevel: gameState.currentLevel
      };
    })
    .subscribe((engineData) => this.setEngineState(engineData.gameStatus, engineData.currentLevel));
  }

  private setEngineState(gameStatus: GameStatus, currentLevel: number): void {
    this.stopEngine();

    if (gameStatus === GameStatus.Playing) {
      this.runEngine(currentLevel);
    }
  }

  private runEngine(currentLevel: number): void {
    this.stopEngine$ = new Subject();

    interval(this.getTickRate(currentLevel))
      .pipe(takeUntil(this.stopEngine$))
      .subscribe(() => this.stateManager.dispatch(new IncrementTick()));
  }

  private stopEngine(): void {
    this.stopEngine$.next();
    this.stopEngine$.complete();
  }

  private getTickRate(currentLevel: number): number {
    if (currentLevel < 10) {
      const tickRates = [ 800, 716, 633, 550, 466, 383, 300, 216, 133, 100 ];
      return tickRates[currentLevel];
    }
    else if (currentLevel >= 10 || currentLevel <= 12) {
      return 83;
    }
    else if (currentLevel >= 13 || currentLevel <= 15) {
      return 66;
    }
    else if (currentLevel >= 16 || currentLevel <= 18) {
      return 50;
    }
    else if (currentLevel >= 19 || currentLevel <= 28) {
      return 33;
    } else {
      return 16;
    }
  }
}