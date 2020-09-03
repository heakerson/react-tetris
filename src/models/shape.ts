import { Cell } from "./cell";
import { Grid } from "./grid";
import { MoveDirection } from "./move-direction";
import { RotationDirection } from "./rotation-direction";
import { ShapeType } from "./shape-type";
import { RotationPoint } from "./rotation-point";

export class Shape {
  get isActive(): boolean {
    // TODO use grid, maybe create an equals method?
    return false;
  };

  private counter = 0;

  constructor(public cells: Cell[], public shapeType: ShapeType, public rotationPoint: RotationPoint) {}

  canRotate(rotationDirection: RotationDirection): boolean {
    // TODO
    return false;
  }

  getNextMoveCells(direction: MoveDirection, grid: Grid): Cell[] {
    switch(direction) {
      case MoveDirection.Down:
        try {
          return this.cells.map(cell => grid.getCell(cell.row-1, cell.column));
        } catch {
          return [];
        }
      case MoveDirection.Left:
        try {
          return this.cells.map(cell => grid.getCell(cell.row, cell.column-1));
        } catch {
          return [];
        }
      case MoveDirection.Right:
        try {
          return this.cells.map(cell => grid.getCell(cell.row, cell.column+1));
        } catch {
          return [];
        }
    }
  }

  getNextRotateCells(rotationDirection: RotationDirection): Cell[] {
    // TODO
    return [];
  }
}