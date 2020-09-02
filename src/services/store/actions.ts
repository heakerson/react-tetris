import { DisplayType } from "../../models/display-type";

export interface IAction {
  type: ActionType;
}

enum ActionType {
  ToggleDisplayType,
  SetDisplayType,
  StartGame,
  PauseGame,
  EndGame,
  ResetGame,
  IncrementLevel,
  IncrementTick
}

class ToggleDisplayType implements IAction {
  type = ActionType.ToggleDisplayType;
}

class SetDisplayType implements IAction {
  type = ActionType.SetDisplayType;

  constructor(public displayType: DisplayType) {}
}

class StartGame implements IAction {
  type = ActionType.StartGame;
}

class PauseGame implements IAction {
  type = ActionType.PauseGame;
}

class EndGame implements IAction {
  type = ActionType.EndGame;
}

class ResetGame implements IAction {
  type = ActionType.ResetGame;
}

class IncrementLevel implements IAction {
  type = ActionType.IncrementLevel;
}

class IncrementTick implements IAction {
  type = ActionType.IncrementTick;
}

export type Action = 
  { type: ActionType.ToggleDisplayType }
  | { type: ActionType.SetDisplayType, displayType: DisplayType }
  | { type: ActionType.StartGame }
  | { type: ActionType.PauseGame }
  | { type: ActionType.EndGame }
  | { type: ActionType.ResetGame }
  | { type: ActionType.IncrementLevel }
  | { type: ActionType.IncrementTick };

export {
  ActionType,
  ToggleDisplayType,
  SetDisplayType,
  StartGame,
  PauseGame,
  EndGame,
  ResetGame,
  IncrementLevel,
  IncrementTick
};