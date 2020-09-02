import { GameState } from "./game-state"
import { Action, ActionType } from "./actions";
import { DisplayType } from "../../models/display-type";
import { GameStatus } from "../../models/game-status";

const reducer = function(gameState: GameState, action: Action): GameState {
  switch(action.type) {
    case ActionType.ToggleDisplayType:
      return {
        ...gameState,
        displayType: gameState.displayType === DisplayType.Mobile ? DisplayType.Desktop : DisplayType.Mobile
      };
    case ActionType.SetDisplayType:
      return {
        ...gameState,
        displayType: action.displayType
      };
    case ActionType.StartGame:
      return {
        ...gameState,
        gameStatus: GameStatus.Playing
      };
    case ActionType.PauseGame:
      return {
        ...gameState,
        gameStatus: GameStatus.Paused
      };
    case ActionType.EndGame:
      return {
        ...gameState,
        gameStatus: GameStatus.End
      }
    case ActionType.ResetGame:
      return {
        ...gameState,
        gameStatus: GameStatus.Start,
        level: 1,
        tickCount: 0
      }
    case ActionType.IncrementLevel:
      return {
        ...gameState,
        level: gameState.level+1
      };
    case ActionType.IncrementTick:
      return {
        ...gameState,
        tickCount: gameState.tickCount + 1
      };
    default:
      return gameState;
  }
}

export default reducer;