import { Cell } from "./cell";

export class Shape {
  isActive: boolean = false;

  constructor(public cells: Cell[]) {}
}