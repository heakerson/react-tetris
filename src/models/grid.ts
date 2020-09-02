import { Cell } from "./cell";
import { Shape } from "./shape";

export class Grid {
  cellRows: Cell[][] = [];
  inactiveShapes: Shape[] = [];
  activeShape?: Shape;

  constructor(public width: number, public height: number) {
    this.initCells();
  }

  getRow(rowIndex: number): Cell[] {
    return this.cellRows[rowIndex];
  }

  getRowRange(rowIndex: number, colStart: number, colEnd: number): Cell[] {
    return this.getRow(rowIndex).filter(cell => cell.column >= colStart && cell.column <= colEnd);
  }

  getColumn(columnIndex: number): Cell[] {
    const column: Cell[] = [];
    
    for (let i = 0; i < this.height; i++) {
      const row = this.getRow(i);
      column.push(row[columnIndex]);
    }

    return column;
  }

  getColRange(colIndex: number, rowStart: number, rowEnd: number): Cell[] {
    return this.getColumn(colIndex).filter(cell => cell.row >= rowStart && cell.row <= rowEnd);
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