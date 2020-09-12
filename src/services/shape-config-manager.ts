import { ShapeConfig } from "../models/shape-config";
import { ShapePositionConfig } from "../models/shape-position-config";
import { ShapeType } from "../models/shape-type";
import { RotationPoint } from "../models/rotation-point";
import { Shape } from "../models/shape";
import { Grid } from "../models/grid";
import { RotationDirection } from "../models/rotation-direction";
import { Cell } from "../models/cell";
import _ from "lodash";

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

  public getNextRotationPoint(currentRotationPoint: RotationPoint, rotationDirection: RotationDirection): RotationPoint {
    if (rotationDirection === RotationDirection.Clockwise) {
      switch(currentRotationPoint) {
        case RotationPoint.A:
          return RotationPoint.B;
        case RotationPoint.B:
          return RotationPoint.C;
        case RotationPoint.C:
          return RotationPoint.D;
        case RotationPoint.D:
          return RotationPoint.A;
      }
    } else {
      switch(currentRotationPoint) {
        case RotationPoint.A:
          return RotationPoint.D;
        case RotationPoint.B:
          return RotationPoint.A;
        case RotationPoint.C:
          return RotationPoint.B;
        case RotationPoint.D:
          return RotationPoint.C;
      }
    }
  }

  private getShiftedCell(blockIndex: number, shape: Shape, grid: Grid, colShift: number, rowShift: number): Cell {
    const orderedCells = shape.cells.map(cell => [cell.column, cell.row]).sort();
    return grid.getCell(orderedCells[blockIndex][1]+rowShift, orderedCells[blockIndex][0]+colShift);
  }

  private getRotatePosition(shapeGrid: string[][], rotationDirection: RotationDirection, shape: Shape, grid: Grid): Cell[] {
    const allCoordinates = this.getAllCoordinates(shapeGrid);
    return allCoordinates.map((coordinates: number[], i: number) => {
      const coordinateDeltaFromCenter = this.getDeltaFromCenter(shapeGrid.length, coordinates);
      const rotatedDeltaFromCenter = this.getRotatedDeltaFromCenter(coordinateDeltaFromCenter, rotationDirection);

      const shiftX = rotatedDeltaFromCenter[0] - coordinateDeltaFromCenter[0];
      const shiftY = rotatedDeltaFromCenter[1] - coordinateDeltaFromCenter[1];

      return this.getShiftedCell(i, shape, grid, shiftX, shiftY);
    })
  }

  private getAllCoordinates(shapeGrid: string[][]): number[][] {
    let allCoordinateObjects: any[] = [];
    
    shapeGrid.slice().reverse().forEach((row, rowIndex) => {
      row.forEach((cellValue: string, columnIndex: number) => {
        if (cellValue !== '_'){
          allCoordinateObjects.push({
            value: cellValue,
            coordinates: [columnIndex, rowIndex]
          })
        } 
      });
    });

    const allCoordinates = _.orderBy(allCoordinateObjects, 'coordinates').map(coordObject => coordObject.coordinates);
    return allCoordinates;
  }

  private getDeltaFromCenter(gridDimensions: number, gridCoordinatePosition: number[]): number[] {
    const isOdd = gridDimensions % 2 === 1;
    const x = gridCoordinatePosition[0];
    const y = gridCoordinatePosition[1];

    if (isOdd) {
      return [
        x - (( gridDimensions - 1) / 2),
        y - (( gridDimensions - 1) / 2)
      ];
    } else {
      return [
        x - ( gridDimensions / 2 ),
        y - ( gridDimensions / 2 )
      ]
    }
  }

  private getRotatedDeltaFromCenter(coordinateDelta: number[], rotationDirection: RotationDirection): number[] {
    const dx = coordinateDelta[0];
    const dy = coordinateDelta[1];

    if (rotationDirection === RotationDirection.Clockwise) {
      return [ dy, -dx ];
    } else {
      return [ -dy, dx ];
    }
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
          if (direction === RotationDirection.Clockwise) {
            return [
              this.getShiftedCell(0, shape, grid, 2, -2),
              this.getShiftedCell(1, shape, grid, 1, -1),
              this.getShiftedCell(2, shape, grid, 0, 0),
              this.getShiftedCell(3, shape, grid, -1, 1),
            ];
          } else {
            return [
              this.getShiftedCell(0, shape, grid, 1, -2),
              this.getShiftedCell(1, shape, grid, 0, -1),
              this.getShiftedCell(2, shape, grid, -1, 0),
              this.getShiftedCell(3, shape, grid, -2, 1),
            ];
          }
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
          if (direction === RotationDirection.Clockwise) {
            return [
              this.getShiftedCell(0, shape, grid, -2, 1),
              this.getShiftedCell(1, shape, grid, -1, 0),
              this.getShiftedCell(2, shape, grid, 0, -1),
              this.getShiftedCell(3, shape, grid, 1, -2),
            ]
          } else {
            return [
              this.getShiftedCell(0, shape, grid, -2, 2),
              this.getShiftedCell(1, shape, grid, -1, 1),
              this.getShiftedCell(2, shape, grid, 0, 0),
              this.getShiftedCell(3, shape, grid, 1, -1),
            ];
          }
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
          if (direction === RotationDirection.Clockwise) {
            return [
              this.getShiftedCell(0, shape, grid, 1, -1),
              this.getShiftedCell(1, shape, grid, 0, 0),
              this.getShiftedCell(2, shape, grid, -1, 1),
              this.getShiftedCell(3, shape, grid, -2, 2),
            ]
          } else {
            return [
              this.getShiftedCell(0, shape, grid, 2, -1),
              this.getShiftedCell(1, shape, grid, 1, 0),
              this.getShiftedCell(2, shape, grid, 0, 1),
              this.getShiftedCell(3, shape, grid, -1, 2),
            ]
          }
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
          if (direction === RotationDirection.Clockwise) {
            return [
              this.getShiftedCell(0, shape, grid, -1, 2),
              this.getShiftedCell(1, shape, grid, 0, 1),
              this.getShiftedCell(2, shape, grid, 1, 0),
              this.getShiftedCell(3, shape, grid, 2, -1),
            ];
          } else {
            return [
              this.getShiftedCell(0, shape, grid, -1, 1),
              this.getShiftedCell(1, shape, grid, 0, 0),
              this.getShiftedCell(2, shape, grid, 1, -1),
              this.getShiftedCell(3, shape, grid, 2, -2),
            ]
          }
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
          ['_', '_', '_'],
        ],
        width: 3,
        height: 2,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getRowRange(row-1, column, column + 2), grid.getCell(row, column + 2)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return this.getRotatePosition([
            ['_', '_', '3'],
            ['0', '1', '2'],
            ['_', '_', '_'],
          ], direction, shape, grid);
        }
      } as ShapePositionConfig,
      B: {
        grid: [
          ['_', '2', '_'],
          ['_', '1', '_'],
          ['_', '0', '3'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getColRange(column, row-2 , row), grid.getCell(row-2, column+1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return this.getRotatePosition([
            ['_', '2', '_'],
            ['_', '1', '_'],
            ['_', '0', '3'],
          ], direction, shape, grid);
        }
      } as ShapePositionConfig,
      C: {
        grid: [
          ['_', '_', '_'],
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
          return this.getRotatePosition([
            ['_', '_', '_'],
            ['1', '2', '3'],
            ['0', '_', '_']
          ], direction, shape, grid);
        }
      } as ShapePositionConfig,
      D: {
        grid: [
          ['0', '1', '_'],
          ['_', '2', '_'],
          ['_', '3', '_'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getRowRange(row, column , column+1), grid.getCell(row-1, column+1), grid.getCell(row-2, column+1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return this.getRotatePosition([
            ['0', '1', '_'],
            ['_', '2', '_'],
            ['_', '3', '_'],
          ], direction, shape, grid);
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
          ['_', '_', '_'],
        ],
        width: 3,
        height: 2,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getRowRange(row-1, column, column + 2), grid.getCell(row, column)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return this.getRotatePosition([
            ['3', '_', '_'],
            ['0', '1', '2'],
            ['_', '_', '_'],
          ], direction, shape, grid);
        }
      } as ShapePositionConfig,
      B: {
        grid: [
          ['_', '2', '3'],
          ['_', '1', '_'],
          ['_', '0', '_'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getColRange(column, row-2 , row), grid.getCell(row, column+1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return this.getRotatePosition([
            ['_', '2', '3'],
            ['_', '1', '_'],
            ['_', '0', '_'],
          ], direction, shape, grid);
        }
      } as ShapePositionConfig,
      C: {
        grid: [
          ['_', '_', '_'],
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
          return this.getRotatePosition([
            ['_', '_', '_'],
            ['1', '2', '3'],
            ['_', '_', '0']
          ], direction, shape, grid);
        }
      } as ShapePositionConfig,
      D: {
        grid: [
          ['_', '3', '_'],
          ['_', '2', '_'],
          ['0', '1', '_'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [grid.getCell(row-2, column), ...grid.getColRange(column+1, row-2, row)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return this.getRotatePosition([
            ['_', '3', '_'],
            ['_', '2', '_'],
            ['0', '1', '_'],
          ], direction, shape, grid);
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
          ['_', '_', '_'],
        ],
        width: 3,
        height: 2,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getRowRange(row, column + 1, column + 2), ...grid.getRowRange(row-1, column, column + 1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return this.getRotatePosition([
            ['_', '0', '1'],
            ['2', '3', '_'],
            ['_', '_', '_'],
          ], direction, shape, grid);
        }
      } as ShapePositionConfig,
      B: {
        grid: [
          ['_', '1', '_'],
          ['_', '0', '3'],
          ['_', '_', '2'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getColRange(column, row-1 , row), ...grid.getColRange(column+1, row-2 , row-1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return this.getRotatePosition([
            ['_', '1', '_'],
            ['_', '0', '3'],
            ['_', '_', '2'],
          ], direction, shape, grid);
        }
      } as ShapePositionConfig,
      C: {
        grid: [
          ['_', '_', '_'],
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
          return this.getRotatePosition([
            ['_', '_', '_'],
            ['_', '0', '1'],
            ['2', '3', '_'],
          ], direction, shape, grid);
        }
      } as ShapePositionConfig,
      D: {
        grid: [
          ['1', '_', '_'],
          ['0', '3', '_'],
          ['_', '2', '_'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getColRange(column, row-1 , row), ...grid.getColRange(column+1, row-2 , row-1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return this.getRotatePosition([
            ['1', '_', '_'],
            ['0', '3', '_'],
            ['_', '2', '_'],
          ], direction, shape, grid);
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
          ['_', '_', '_'],
        ],
        width: 3,
        height: 2,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getRowRange(row, column, column + 1), ...grid.getRowRange(row-1, column+1, column + 2)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return this.getRotatePosition([
            ['0', '1', '_'],
            ['_', '2', '3'],
            ['_', '_', '_'],
          ], direction, shape, grid);
        }
      } as ShapePositionConfig,
      B: {
        grid: [
          ['_', '_', '3'],
          ['_', '1', '2'],
          ['_', '0', '_'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getColRange(column, row-2 , row-1), ...grid.getColRange(column+1, row-1 , row)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return this.getRotatePosition([
            ['_', '_', '3'],
            ['_', '1', '2'],
            ['_', '0', '_'],
          ], direction, shape, grid);
        }
      } as ShapePositionConfig,
      C: {
        grid: [
          ['_', '_', '_'],
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
          return this.getRotatePosition([
            ['_', '_', '_'],
            ['0', '1', '_'],
            ['_', '2', '3'],
          ], direction, shape, grid);
        }
      } as ShapePositionConfig,
      D: {
        grid: [
          ['_', '3', '_'],
          ['1', '2', '_'],
          ['0', '_', '_'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getColRange(column, row-2 , row-1), ...grid.getColRange(column+1, row-1 , row)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return this.getRotatePosition([
            ['_', '3', '_'],
            ['1', '2', '_'],
            ['0', '_', '_'],
          ], direction, shape, grid);
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
          ['_', '_', '_'],
        ],
        width: 3,
        height: 2,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getRowRange(row-1, column, column + 2), grid.getCell(row, column+1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return this.getRotatePosition([
            ['_', '3', '_'],
            ['0', '1', '2'],
            ['_', '_', '_'],
          ], direction, shape, grid);
        }
      } as ShapePositionConfig,
      B: {
        grid: [
          ['_', '2', '_'],
          ['_', '1', '3'],
          ['_', '0', '_'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [...grid.getColRange(column, row-2 , row), grid.getCell(row-1, column+1)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return this.getRotatePosition([
            ['_', '2', '_'],
            ['_', '1', '3'],
            ['_', '0', '_'],
          ], direction, shape, grid);
        }
      } as ShapePositionConfig,
      C: {
        grid: [
          ['_', '_', '_'],
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
          return this.getRotatePosition([
            ['_', '_', '_'],
            ['1', '2', '3'],
            ['_', '0', '_']
          ], direction, shape, grid);
        }
      } as ShapePositionConfig,
      D: {
        grid: [
          ['_', '3', '_'],
          ['0', '2', '_'],
          ['_', '1', '_'],
        ],
        width: 2,
        height: 3,
        getPositionGivenRectangleCorner: (upperLeftRectangleCell: Cell, grid: Grid): Cell[] => {
          const { row, column } = upperLeftRectangleCell;
          return [grid.getCell(row-1, column), ...grid.getColRange(column+1, row-2, row)];
        },
        getRotatedPosition: (shape: Shape, grid: Grid, direction: RotationDirection): Cell[] => {
          return this.getRotatePosition([
            ['_', '3', '_'],
            ['0', '2', '_'],
            ['_', '1', '_'],
          ], direction, shape, grid);
        }
      } as ShapePositionConfig,
    } as ShapeConfig;
  }
}