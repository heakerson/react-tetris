import { Shape } from "./shape";

export class Cell {
  shape?: Shape;

  constructor(public row: number, public column: number) { }
}