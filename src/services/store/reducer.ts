import { GameState } from "./game-state"
import { Action, ActionType } from "./actions";
import { DisplayType } from "../../models/display-type";
import { GameStatus } from "../../models/game-status";
import { Shape } from "../../models/shape";
import { InputType } from "../../models/input-type";

const reducer = function(gameState: GameState, action: Action): GameState {
  switch(action.type) {
    case ActionType.ToggleDisplayType:
      return {
        ...gameState,
        displayType: gameState.displayType === DisplayType.Mobile ? DisplayType.Desktop : DisplayType.Mobile
      };
    case ActionType.ToggleInputType:
      return {
        ...gameState,
        inputType: gameState.inputType === InputType.Keyboard ? InputType.Touch : InputType.Keyboard
      };
    case ActionType.SetDisplayType:
      return {
        ...gameState,
        displayType: action.displayType
      };
    case ActionType.SetInputType:
      return {
        ...gameState,
        inputType: action.inputType
      };
    case ActionType.StartGame:
      return {
        ...gameState,
        gameStatus: GameStatus.Playing
      };
    case ActionType.ClearingRows:
      return {
        ...gameState,
        gameStatus: GameStatus.ClearingRows
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
      gameState.grid.cellRows.forEach(row => row.forEach(cell => cell.inactiveShape = undefined));
      gameState.grid.occupiedCellsByColumn = {};

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
        grid.activeShape.cells.forEach(activeCell => {
          const columnData: number[] = grid.occupiedCellsByColumn[activeCell.column];
          if (columnData) {
            columnData.push(activeCell.row);
          } else {
            grid.occupiedCellsByColumn[activeCell.column] = [ activeCell.row ];
          }
        });

        grid.activeShape.cells.forEach(cell => cell.inactiveShape = grid.activeShape);
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
      if (gameState.grid.activeShape) {
        gameState.grid.activeShape.cells = action.nextCells;

        if (action.nextRotationPoint) {
          gameState.grid.activeShape.rotationPoint = action.nextRotationPoint;
        }
      }
      return {
        ...gameState
      }
    default:
      return gameState;
  }
}

export default reducer;