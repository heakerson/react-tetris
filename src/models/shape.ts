import { Cell } from "./cell";
import { Grid } from "./grid";
import { MoveDirection } from "./move-direction";
import { ShapeType } from "./shape-type";
import { RotationPoint } from "./rotation-point";
import _ from "lodash";

export class Shape {

  constructor(public cells: Cell[], public shapeType: ShapeType, public rotationPoint: RotationPoint) {}

  getNextMoveCells(direction: MoveDirection, grid: Grid, shiftAmount: number = 1): Cell[] {
    switch(direction) {
      case MoveDirection.Down:
        try {
          return this.cells.map(cell => grid.getCell(cell.row-shiftAmount, cell.column));
        } catch {
          return [];
        }
      case MoveDirection.Left:
        try {
          return this.cells.map(cell => grid.getCell(cell.row, cell.column-shiftAmount));
        } catch {
          return [];
        }
      case MoveDirection.Right:
        try {
          return this.cells.map(cell => grid.getCell(cell.row, cell.column+shiftAmount));
        } catch {
          return [];
        }
    }
  }

  getBottomCells(): Cell[] {
    const columnIndices = this.getAllColumns();
    return columnIndices.map(columnIndex => {
      const orderedCellsInColumn = _.orderBy(this.getCellsInColumn(columnIndex), 'row');
      return orderedCellsInColumn[0];
    });
  }

  getCellsInColumn(columnIndex: number): Cell[] {
    return this.cells.filter(cell => cell.column === columnIndex);
  }

  getAllColumns(): number[] {
    return _.uniq(this.cells.map(cell => cell.column));
  }

  getAllRows(): number[] {
    return _.uniq(this.cells.map(cell => cell.row));
  }

  containsCellAt(rowIndex: number, columnIndex: number): boolean {
    const found = this.cells.find(cell => cell.row === rowIndex && cell.column === columnIndex);
    return !!found;
  }
}