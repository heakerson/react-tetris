import { ShapeConfig } from "../models/shape-config";
import { ShapePositionConfig } from "../models/shape-position-config";
import { ShapeType } from "../models/shape-type";
import { RotationPoint } from "../models/rotation-point";
import { Shape } from "../models/shape";
import { Grid } from "../models/grid";
import { RotationDirection } from "../models/rotation-direction";
import { Cell } from "../models/cell";

export class ShapeConfigManager {
  private Bar: ShapeConfig = new ShapeConfig();
  private L: ShapeConfig = new ShapeConfig();
  private ReverseL: ShapeConfig = new ShapeConfig();
  private Box: ShapeConfig = new ShapeConfig();
  private S: ShapeConfig = new ShapeConfig();
  private Z: ShapeConfig = new ShapeConfig();
  private T: ShapeConfig = new ShapeConfig();

  constructor() {
    this.initBarConfig();
    this.initLConfig();
    this.initReverseLConfig();
    this.initBoxConfig();
    this.initSConfig();
    this.initZConfig();
    this.initTConfig();
  }

  public getConfigFor(shapeType: ShapeType, rotationPosition: RotationPoint): ShapePositionConfig {
    return this[shapeType][rotationPosition];
  }

  private initBarConfig(): void {
    this.Bar = {
      A: {
        grid: [
          ['0', '1', '2', '3'],
        ],
        width: 4,
        height: 1,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return grid.getRowRange(row, column, column + 3);
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
      B: {
        grid: [
          ['3'],
          ['2'],
          ['1'],
          ['0'],
        ],
        width: 1,
        height: 4,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return grid.getColRange(column, row-3 , row);
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
      C: {
        grid: [
          ['0', '1', '2', '3'],
        ],
        width: 4,
        height: 1,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return grid.getRowRange(row, column, column + 3);
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
      D: {
        grid: [
          ['3'],
          ['2'],
          ['1'],
          ['0'],
        ],
        width: 1,
        height: 4,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return grid.getColRange(column, row-3 , row);
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
    } as ShapeConfig;
  }

  private initLConfig(): void {
    this.L = {
      A: {
        grid: [
          ['_', '_', '3'],
          ['0', '1', '2'],
        ],
        width: 3,
        height: 2,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getRowRange(row-1, column, column + 2), grid.getCell(row, column + 2)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
      B: {
        grid: [
          ['2', '_'],
          ['1', '_'],
          ['0', '3'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getColRange(column, row-2 , row), grid.getCell(row-2, column+1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
      C: {
        grid: [
          ['1', '2', '3'],
          ['0', '_', '_']
        ],
        width: 3,
        height: 2,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [grid.getCell(row-1, column), ...grid.getRowRange(row, column, column + 2)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
      D: {
        grid: [
          ['0', '1'],
          ['_', '2'],
          ['_', '3'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getRowRange(row, column , column+1), grid.getCell(row-1, column+1), grid.getCell(row-2, column+1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
    } as ShapeConfig;
  }

  private initReverseLConfig(): void {
    this.ReverseL = {
      A: {
        grid: [
          ['3', '_', '_'],
          ['0', '1', '2'],
        ],
        width: 3,
        height: 2,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getRowRange(row-1, column, column + 2), grid.getCell(row, column)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
      B: {
        grid: [
          ['2', '3'],
          ['1', '_'],
          ['0', '_'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getColRange(column, row-2 , row), grid.getCell(row, column+1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
      C: {
        grid: [
          ['1', '2', '3'],
          ['_', '_', '0']
        ],
        width: 3,
        height: 2,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [grid.getCell(row-1, column+2), ...grid.getRowRange(row, column, column + 2)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
      D: {
        grid: [
          ['_', '3'],
          ['_', '2'],
          ['0', '1'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [grid.getCell(row-2, column+1), ...grid.getColRange(column+1, row-2, row)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
    } as ShapeConfig;
  }

  private initBoxConfig(): void {
    this.Box = {
      A: {
        grid: [
          ['0', '1'],
          ['2', '3'],
        ],
        width: 2,
        height: 2,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getRowRange(row, column, column + 1), ...grid.getRowRange(row-1, column, column + 1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return shape.cells;
        }
      } as ShapePositionConfig,
      B: {
        grid: [
          ['0', '1'],
          ['2', '3'],
        ],
        width: 2,
        height: 2,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getRowRange(row, column, column + 1), ...grid.getRowRange(row-1, column, column + 1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return shape.cells;
        }
      } as ShapePositionConfig,
      C: {
        grid: [
          ['0', '1'],
          ['2', '3'],
        ],
        width: 2,
        height: 2,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getRowRange(row, column, column + 1), ...grid.getRowRange(row-1, column, column + 1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return shape.cells;
        }
      } as ShapePositionConfig,
      D: {
        grid: [
          ['0', '1'],
          ['2', '3'],
        ],
        width: 2,
        height: 2,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getRowRange(row, column, column + 1), ...grid.getRowRange(row-1, column, column + 1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return shape.cells;
        }
      } as ShapePositionConfig,
    } as ShapeConfig;
  }

  private initSConfig(): void {
    this.S = {
      A: {
        grid: [
          ['_', '0', '1'],
          ['2', '3', '_'],
        ],
        width: 3,
        height: 2,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getRowRange(row, column + 1, column + 2), ...grid.getRowRange(row-1, column, column + 1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
      B: {
        grid: [
          ['1', '_'],
          ['0', '3'],
          ['_', '2'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getColRange(column, row-1 , row), ...grid.getColRange(column+1, row-2 , row-1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
      C: {
        grid: [
          ['_', '0', '1'],
          ['2', '3', '_'],
        ],
        width: 3,
        height: 2,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getRowRange(row, column + 1, column + 2), ...grid.getRowRange(row-1, column, column + 1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
      D: {
        grid: [
          ['1', '_'],
          ['0', '3'],
          ['_', '2'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getColRange(column, row-1 , row), ...grid.getColRange(column+1, row-2 , row-1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
    } as ShapeConfig;
  }

  private initZConfig(): void {
    this.Z = {
      A: {
        grid: [
          ['0', '1', '_'],
          ['_', '2', '3'],
        ],
        width: 3,
        height: 2,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getRowRange(row, column, column + 1), ...grid.getRowRange(row-1, column+1, column + 2)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
      B: {
        grid: [
          ['_', '3'],
          ['1', '2'],
          ['0', '_'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getColRange(column, row-2 , row-1), ...grid.getColRange(column+1, row-1 , row)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
      C: {
        grid: [
          ['0', '1', '_'],
          ['_', '2', '3'],
        ],
        width: 3,
        height: 2,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getRowRange(row, column, column + 1), ...grid.getRowRange(row-1, column+1, column + 2)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
      D: {
        grid: [
          ['_', '3'],
          ['1', '2'],
          ['0', '_'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getColRange(column, row-2 , row-1), ...grid.getColRange(column+1, row-1 , row)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
    } as ShapeConfig;
  }

  private initTConfig(): void {
    this.T = {
      A: {
        grid: [
          ['_', '3', '_'],
          ['0', '1', '2'],
        ],
        width: 3,
        height: 2,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getRowRange(row-1, column, column + 2), grid.getCell(row, column+1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
      B: {
        grid: [
          ['2', '_'],
          ['1', '3'],
          ['0', '_'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getColRange(column, row-2 , row), grid.getCell(row-1, column+1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
      C: {
        grid: [
          ['1', '2', '3'],
          ['_', '0', '_']
        ],
        width: 3,
        height: 2,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [grid.getCell(row-1, column+1), ...grid.getRowRange(row, column, column + 2)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
      D: {
        grid: [
          ['_', '3'],
          ['0', '2'],
          ['_', '1'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [grid.getCell(row-1, column), ...grid.getColRange(column+1, row-2, row)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return [];  // TODO
        }
      } as ShapePositionConfig,
    } as ShapeConfig;
  }
}