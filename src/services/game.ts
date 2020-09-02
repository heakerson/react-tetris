import { GameState } from "./store/game-state";
import StateManager from "./state-manager";
import { IAction } from "./store/actions";
import { Subject } from "rxjs";
import { GameStatus } from "../models/game-status";


export default class Game {
  private stateManager: StateManager = new StateManager();
  private levelSubject?: Subject<number>;

  constructor() {
    this.stateManager.selectGameState(gameState => gameState.gameStatus).subscribe((gameStatus: GameStatus) => this.setEngineState(gameStatus));
  }

  public setComponentGameStateListener<TStateType>(getStateFn: (state: GameState) => TStateType): TStateType {
    return this.stateManager.setGameStateListener(getStateFn);
  }

  public dispatch(action: IAction): void {
    this.stateManager.dispatch(action);
  }

  private runEngine(): void {
    console.log('RUNNING');
  }

  private pauseEngine(): void {
    console.log('PAUSED');
  }

  private resetEngine(): void {
    console.log('RESET');
  }

  private setEngineState(gameStatus: GameStatus): void {
    switch(gameStatus) {
      case GameStatus.Start:
        this.resetEngine();
        break;
      case GameStatus.Paused:
      case GameStatus.End:
        this.pauseEngine();
        break;
      case GameStatus.Playing:
        this.runEngine();
        break;
    }
  }
}