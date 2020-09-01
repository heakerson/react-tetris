import { GameState } from "./store/game-state";
import StateManager from "./state-manager";
import { IAction } from "./store/actions";


export default class Game {
  private stateManager: StateManager = new StateManager();

  public resetGame(): void {
    this.stateManager.resetGame();
  }

  public setGameStateListener<TStateType>(getStateFn: (state: GameState) => TStateType): TStateType {
    return this.stateManager.setGameStateListener(getStateFn);
  }

  // public updateGameState(setStateFn: (state: GameState) => GameState): void {
  //   this.stateManager.updateGameState(setStateFn);
  // }

  public dispatch(action: IAction): void {
    this.stateManager.dispatch(action);
  }
}