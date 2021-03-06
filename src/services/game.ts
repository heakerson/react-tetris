import { GameState } from "./store/game-state";
import StateManager from "./state-manager";
import { IAction } from "./store/actions";
import { GameEngine } from "./game-engine";
import { GameCore } from "./game-core";
import { ShapeConfigManager } from "./shape-config-manager";
import { UserData } from "../models/user-data";


export default class Game {
  stateManager: StateManager = new StateManager();
  shapeManager: ShapeConfigManager = new ShapeConfigManager();
  gameEngine: GameEngine = new GameEngine(this.stateManager);
  gameCore: GameCore = new GameCore(this.stateManager, this.shapeManager);

  public setComponentGameStateListener<TStateType>(getStateFn: (state: GameState) => TStateType): TStateType {
    return this.stateManager.setComponentGameStateListener(getStateFn);
  }

  public dispatch(action: IAction): void {
    this.stateManager.dispatch(action);
  }

  public setUserData(setDataFn: (userData: UserData) => UserData): void {
    this.gameCore.setUserData(setDataFn);
  }
}