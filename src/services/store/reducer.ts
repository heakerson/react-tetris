import { GameState } from "./game-state"
import { Action, ActionType } from "./actions";
import { DisplayType } from "../../models/display-type";
import { GameStatus } from "../../models/game-status";
import { Shape } from "../../models/shape";

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
      gameState.grid.activeShape = undefined;
      gameState.grid.inactiveShapes = [];

      return {
        ...gameState,
        gameStatus: GameStatus.Start,
        level: 1,
        tickCount: 0,
        nextShape: undefined
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
    case ActionType.RotateActiveAndNextShapes:
      const grid = gameState.grid;

      if (grid.activeShape) {
        grid.inactiveShapes.push(grid.activeShape as Shape);
      }
      if (gameState.nextShape) {
        grid.activeShape = gameState.nextShape;
        grid.activeShape.cells = action.activeShapeStartCells;
      }

      return {
        ...gameState,
        nextShape: action.newNextShape
      }
    case ActionType.InitActiveAndNextShape:
      gameState.grid.activeShape = action.activeShape;
      return {
        ...gameState,
        nextShape: action.nextShape
      }
    case ActionType.MoveActiveShape:
      (gameState.grid.activeShape as any).cells = action.nextCells;
      return {
        ...gameState
      }
    default:
      return gameState;
  }
}

export default reducer;