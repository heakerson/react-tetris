import { GameState } from "./game-state"
import { Action, ActionType } from "./actions";
import { DisplayType } from "../../models/display-type";

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
    default:
      return gameState;
  }
}

export default reducer;