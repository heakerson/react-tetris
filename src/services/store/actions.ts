import { DisplayType } from "../../models/display-type";
import { Shape } from "../../models/shape";
import { Cell } from "../../models/cell";
import { RotationPoint } from "../../models/rotation-point";
import { InputType } from "../../models/input-type";
import { Subject } from "rxjs";

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
  IncrementScore,
  RotateActiveAndNextShapes,
  MoveActiveShape,
  InitActiveAndNextShape,
  ClearActiveShape,
  AnimateCell,
  SettleGridRows,
  IncrementRowCount
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

  constructor(public newTopScore?: number, public newTopRows?: number, public newTopLevel?: number) {}
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

class AnimateCell implements IAction {
  type = ActionType.AnimateCell;

  constructor(public columnIndex: number, public rowIndex: number, public clearing$: Subject<any>) {}
}

class SettleGridRows implements IAction {
  type = ActionType.SettleGridRows;

  constructor(public rowIndexes: number[]) { }
}

class IncrementRowCount implements IAction {
  type = ActionType.IncrementRowCount;

  constructor(public incrementBy: number) { }
}

class IncrementScore implements IAction {
  type = ActionType.IncrementScore;

  constructor(public incrementAmount: number) { }
}

export type Action = 
  { type: ActionType.ToggleDisplayType }
  | { type: ActionType.ToggleInputType }
  | { type: ActionType.SetDisplayType, displayType: DisplayType }
  | { type: ActionType.SetInputType, inputType: InputType }
  | { type: ActionType.StartGame }
  | { type: ActionType.SetClearingRowsStatus }
  | { type: ActionType.PauseGame }
  | { type: ActionType.EndGame, newTopScore?: number, newTopRows?: number, newTopLevel?: number }
  | { type: ActionType.ResetGame }
  | { type: ActionType.IncrementLevel }
  | { type: ActionType.IncrementTick }
  | { type: ActionType.RotateActiveAndNextShapes, newNextShape: Shape, activeShapeStartCells: Cell[] }
  | { type: ActionType.MoveActiveShape, nextCells: Cell[], nextRotationPoint?: RotationPoint }
  | { type: ActionType.InitActiveAndNextShape, activeShape: Shape, nextShape: Shape }
  | { type: ActionType.ClearActiveShape }
  | { type: ActionType.AnimateCell, columnIndex: number, rowIndex: number, clearing$: Subject<any> }
  | { type: ActionType.SettleGridRows, rowIndexes: number[] }
  | { type: ActionType.IncrementRowCount, incrementBy: number }
  | { type: ActionType.IncrementScore, incrementAmount: number }
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
  IncrementScore,
  RotateActiveAndNextShapes,
  MoveActiveShape,
  InitActiveAndNextShape,
  ClearActiveShape,
  AnimateCell,
  SettleGridRows,
  IncrementRowCount
};