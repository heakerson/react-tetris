import { DisplayType } from "../../models/display-type";
import { Shape } from "../../models/shape";
import { Cell } from "../../models/cell";
import { RotationPoint } from "../../models/rotation-point";

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
  IncrementTick,
  RotateActiveAndNextShapes,
  MoveActiveShape,
  InitActiveAndNextShape
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

export type Action = 
  { type: ActionType.ToggleDisplayType }
  | { type: ActionType.SetDisplayType, displayType: DisplayType }
  | { type: ActionType.StartGame }
  | { type: ActionType.PauseGame }
  | { type: ActionType.EndGame }
  | { type: ActionType.ResetGame }
  | { type: ActionType.IncrementLevel }
  | { type: ActionType.IncrementTick }
  | { type: ActionType.RotateActiveAndNextShapes, newNextShape: Shape, activeShapeStartCells: Cell[] }
  | { type: ActionType.MoveActiveShape, nextCells: Cell[], nextRotationPoint?: RotationPoint }
  | { type: ActionType.InitActiveAndNextShape, activeShape: Shape, nextShape: Shape }
  ;

export {
  ActionType,
  ToggleDisplayType,
  SetDisplayType,
  StartGame,
  PauseGame,
  EndGame,
  ResetGame,
  IncrementLevel,
  IncrementTick,
  RotateActiveAndNextShapes,
  MoveActiveShape,
  InitActiveAndNextShape
};