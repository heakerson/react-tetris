import { Grid } from "./grid";
import { Cell } from "./cell";
import { RotationDirection } from "./rotation-direction";
import { Shape } from "./shape";

export class ShapePositionConfig {
  grid: string[][] = [];
  width: number = 0;
  height: number = 0;
  getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid) => Cell[] = () => [];
  getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection) => Cell[] = () => [];
}