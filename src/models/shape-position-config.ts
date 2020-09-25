import { Grid } from "./grid";
import { Cell } from "./cell";
import { RotationDirection } from "./rotation-direction";
import { Shape } from "./shape";
import _ from "lodash";

export class ShapePositionConfig {
  get widthMiniGrid(): number {
    if (this.miniGrid && this.miniGrid.length > 0) {
      return this.miniGrid[0].length;
    }
    return 0;
  }

  get heightMiniGrid(): number {
    if (this.miniGrid && this.miniGrid.length > 0) {
      return this.miniGrid.length;
    }
    return 0;
  }

  constructor(public miniGrid: string[][]) { }

  public getPositionGivenRectangleCorner(upperLeftRectangleCell: Cell, grid: Grid): Cell[] {
    const miniGrid = this.shiftMiniGridTopLeft();
    const { row, column } = upperLeftRectangleCell;
    const allCoordinates = this.getAllMiniGridCoordinates();

    let gridPosition = allCoordinates.map((coordinate: number[]) => {
      return grid.getCell(row - Math.abs(miniGrid.length - 1 - coordinate[1]), column + coordinate[0]);
    });

    gridPosition = _.sortBy(gridPosition, (cell) => cell.row, (cell) => cell.column);

    return gridPosition;
  };

  public getRotatedPosition(shape: Shape, grid: Grid, rotationDirection: RotationDirection): Cell[] {
    const allCoordinates = this.getAllMiniGridCoordinates();

    return allCoordinates.map((coordinates: number[], i: number) => {
      const coordinateDeltaFromCenter = this.getDeltaFromCenter(coordinates);
      const rotatedDeltaFromCenter = this.getRotatedDeltaFromCenter(coordinateDeltaFromCenter, rotationDirection);

      const isEven = this.miniGrid.length % 2 === 0;
      const isCounterClockWise = rotationDirection === RotationDirection.CounterClockwise;
      const shiftX = rotatedDeltaFromCenter[0] - coordinateDeltaFromCenter[0] - (isEven && isCounterClockWise ? 1 : 0);
      const shiftY = rotatedDeltaFromCenter[1] - coordinateDeltaFromCenter[1] - (isEven && !isCounterClockWise ? 1 : 0);

      return this.getShiftedCell(i, shape, grid, shiftX, shiftY);
    })
  }

  public miniGridOccupiedAt(row: number, column: number): boolean {
    if (this.miniGrid) {
      return this.miniGrid[row][column] !== '_';
    }

    return false;
  }

  private getShiftedCell(blockIndex: number, shape: Shape, grid: Grid, colShift: number, rowShift: number): Cell {
    const shapeCells = _.orderBy(shape.cells, ['row', 'column'], [ 'asc', 'asc' ]);
    const shapeCoordinates = shapeCells.map(cell => [cell.column, cell.row]);

    return grid.getCell(shapeCoordinates[blockIndex][1]+rowShift, shapeCoordinates[blockIndex][0]+colShift);
  }

  private getDeltaFromCenter(gridCoordinatePosition: number[]): number[] {
    const gridDimensions = this.miniGrid.length;
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

  private getAllMiniGridCoordinates(): number[][] {
    let allCoordinateObjects: any[] = [];
    
    this.miniGrid.slice().reverse().forEach((row, rowIndex) => {
      row.forEach((cellValue: string, columnIndex: number) => {
        if (cellValue !== '_'){
          allCoordinateObjects.push({
            value: cellValue,
            coordinates: [columnIndex, rowIndex]
          })
        } 
      });
    });

    let allCoordinates = _.orderBy(allCoordinateObjects, 'coordinates').map(coordObject => coordObject.coordinates);
    allCoordinates = _.sortBy(allCoordinates, (coord) => coord[1], (coord) => coord[0]);
    return allCoordinates;
  }

  private shiftMiniGridTopLeft(): string[][] {
    let miniGridCopy = _.cloneDeep(this.miniGrid);

    // SHIFTING MINI GRID UP
    let checkTopRow = true;
    while (checkTopRow) {
      const topRowIsEmpty = miniGridCopy[0].findIndex(entry => entry !== '_') === -1;

      if (topRowIsEmpty) {
        miniGridCopy.shift();
      } else {
        checkTopRow = false;
      }
    }

    miniGridCopy = this.removeMiniGridLeftEmptyColumns(miniGridCopy);

    return miniGridCopy;
  }

  private removeMiniGridLeftEmptyColumns(miniGrid: string[][]): string[][] {
    let miniGridCopy = _.cloneDeep(miniGrid);
    let checkFirstColumn = true;

    while (checkFirstColumn) {
      let columnContainsEntry = false;
      for (let r = 0; r < miniGridCopy.length; r++) {
        if (miniGridCopy[r][0] !== '_') {
          columnContainsEntry = true;
          break;
        }
      }

      if (columnContainsEntry) {
        checkFirstColumn = false;
      } else {
        for (let r = 0; r < miniGridCopy.length; r++) {
          miniGridCopy[r].shift();
        }
      }
    }

    return miniGridCopy;
  }
}