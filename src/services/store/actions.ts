import { DisplayType } from "../../models/display-type";
import { Shape } from "../../models/shape";
import { Cell } from "../../models/cell";
import { RotationPoint } from "../../models/rotation-point";
import { InputType } from "../../models/input-type";

export interface IAction {
  type: ActionType;
}

enum ActionType {
  ToggleDisplayType,
  ToggleInputType,
  SetDisplayType,
  SetInputType,
  StartGame,
  SetClearingRowsStatus,
  PauseGame,
  EndGame,
  ResetGame,
  IncrementLevel,
  IncrementTick,
  RotateActiveAndNextShapes,
  MoveActiveShape,
  InitActiveAndNextShape,
  ClearActiveShape
}

class ToggleDisplayType implements IAction {
  type = ActionType.ToggleDisplayType;
}

class ToggleInputType implements IAction {
  type = ActionType.ToggleInputType;
}

class SetDisplayType implements IAction {
  type = ActionType.SetDisplayType;

  constructor(public displayType: DisplayType) {}
}

class SetInputType implements IAction {
  type = ActionType.SetInputType;

  constructor(public inputType: InputType) {}
}

class StartGame implements IAction {
  type = ActionType.StartGame;
}

class SetClearingRowsStatus implements IAction {
  type = ActionType.SetClearingRowsStatus;
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

class RotateActiveAndNextShapes implements IAction {
  type = ActionType.RotateActiveAndNextShapes;

  constructor(public activeShapeStartCells: Cell[], public newNextShape: Shape) {}
}

class MoveActiveShape implements IAction {
  type = ActionType.MoveActiveShape;

  constructor(public nextCells: Cell[], public nextRotationPoint?: RotationPoint) {}
}

class InitActiveAndNextShape implements IAction {
  type = ActionType.InitActiveAndNextShape;

  constructor(public activeShape: Shape, public nextShape: Shape) {}
}

class ClearActiveShape implements IAction {
  type = ActionType.ClearActiveShape;
}

export type Action = 
  { type: ActionType.ToggleDisplayType }
  | { type: ActionType.ToggleInputType }
  | { type: ActionType.SetDisplayType, displayType: DisplayType }
  | { type: ActionType.SetInputType, inputType: InputType }
  | { type: ActionType.StartGame }
  | { type: ActionType.SetClearingRowsStatus }
  | { type: ActionType.PauseGame }
  | { type: ActionType.EndGame }
  | { type: ActionType.ResetGame }
  | { type: ActionType.IncrementLevel }
  | { type: ActionType.IncrementTick }
  | { type: ActionType.RotateActiveAndNextShapes, newNextShape: Shape, activeShapeStartCells: Cell[] }
  | { type: ActionType.MoveActiveShape, nextCells: Cell[], nextRotationPoint?: RotationPoint }
  | { type: ActionType.InitActiveAndNextShape, activeShape: Shape, nextShape: Shape }
  | { type: ActionType.ClearActiveShape }
  ;

export {
  ActionType,
  ToggleDisplayType,
  ToggleInputType,
  SetDisplayType,
  SetInputType,
  StartGame,
  SetClearingRowsStatus,
  PauseGame,
  EndGame,
  ResetGame,
  IncrementLevel,
  IncrementTick,
  RotateActiveAndNextShapes,
  MoveActiveShape,
  InitActiveAndNextShape,
  ClearActiveShape
};