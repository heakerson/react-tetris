import { GameState } from "./store/game-state";
import StateManager from "./state-manager";
import { IAction } from "./store/actions";
import { GameEngine } from "./game-engine";
import { GameCore } from "./game-core";


export default class Game {
  stateManager: StateManager = new StateManager();
  gameEngine: GameEngine = new GameEngine(this.stateManager);
  gameCore: GameCore = new GameCore(this.stateManager);

  public setComponentGameStateListener<TStateType>(getStateFn: (state: GameState) => TStateType): TStateType {
    return this.stateManager.setComponentGameStateListener(getStateFn);
  }

  public dispatch(action: IAction): void {
    this.stateManager.dispatch(action);
  }
}