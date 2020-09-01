import { Shape } from "@material-ui/core/styles/shape";
import { Cell } from "./cell";

export class Grid {
  cells: Cell[][] = [];
  shapes: Shape[] = [];
  activeShape?: Shape;

  constructor(public width: number, public height: number) {
    this.initCells();
  }

  initCells(): void {
    // TODO
  }
}