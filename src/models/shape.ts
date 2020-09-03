import { Cell } from "./cell";
import { Grid } from "./grid";
import { MoveDirection } from "./move-direction";
import { RotationDirection } from "./rotation-direction";
import { ShapeType } from "./shape-type";

export class Shape {
  get isActive(): boolean {
    // TODO use grid, maybe create an equals method?
    return false;
  };

  private counter = 0;

  constructor(public cells: Cell[], public shapeType: ShapeType, private grid: Grid) {}

  canMove(direction: MoveDirection): boolean {
    this.counter++;

    if (this.counter < 5) {
      return true;
    }
    // TODO
    return false;
  }

  canRotate(rotationDirection: RotationDirection): boolean {
    // TODO
    return false;
  }

  getNextMoveCells(direction: MoveDirection): Cell[] {
    // TODO
    return [];
  }

  getNextRotateCells(rotationDirection: RotationDirection): Cell[] {
    // TODO
    return [];
  }
}