import { DisplayType } from "../../models/display-type";

export interface IAction {
  type: ActionType;
}

enum ActionType {
  ToggleDisplayType,
  SetDisplayType
}

class ToggleDisplayType implements IAction {
  type = ActionType.ToggleDisplayType;
}

class SetDisplayType implements IAction {
  type = ActionType.SetDisplayType;

  constructor(public displayType: DisplayType) {}
}

export type Action = 
  { type: ActionType.ToggleDisplayType }
  | { type: ActionType.SetDisplayType, displayType: DisplayType };

export {
  ToggleDisplayType,
  SetDisplayType,
  ActionType
};