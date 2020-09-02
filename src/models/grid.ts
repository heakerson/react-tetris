import { Shape } from "@material-ui/core/styles/shape";
import { Cell } from "./cell";

export class Grid {
  cellRows: Cell[][] = [];
  shapes: Shape[] = [];
  activeShape?: Shape;

  constructor(public width: number, public height: number) {
    this.initCells();
  }

  getRow(rowIndex: number): Cell[] {
    return this.cellRows[rowIndex];
  }

  getColumn(columnIndex: number): Cell[] {
    const column: Cell[] = [];
    
    for (let i = 0; i < this.height; i++) {
      const row = this.getRow(i);
      column.push(row[columnIndex]);
    }

    return column;
  }

  initCells(): void {
    for (let i = 0; i < this.height; i++) {
      const row: Cell[] = [];

      for (let j = 0; j < this.width; j++) {
        row.push(new Cell(i, j));
      }

      this.cellRows.push(row);
    }
  }
}