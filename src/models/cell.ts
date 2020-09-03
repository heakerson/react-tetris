import { Shape } from "./shape";

export class Cell {
  inactiveShape?: Shape;

  constructor(public row: number, public column: number) { }
}