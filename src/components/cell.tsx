import React from "react";
import Game from "../services/game";
import './cell.css';
import { Shape } from "../models/shape";
import { Cell as CellModel } from "../models/cell";

function Cell(props: { game: Game, rowIndex: number, columnIndex: number }) {
  const { rowIndex, columnIndex, game } = props;

  const cellData = game.setComponentGameStateListener(gameState => {
    const { activeShape } = gameState.grid;
    const cell = gameState.grid.getCell(rowIndex, columnIndex);

    return {
      cell: cell,
      gameStatus: gameState.gameStatus,
      containingActiveShape: activeShape && activeShape.containsCellAt(rowIndex, columnIndex) ? activeShape : null,
      clearing$: cell.clearing$,
      gridColumnCount: gameState.gridWidth,
      gridRowCount: gameState.gridHeight
    }
  });

  if (cellData.clearing$) {
    setTimeout(() => {
      cellData.clearing$?.next();
      cellData.clearing$?.complete();
    }, 1000);
  }

  const classes = `${getCellStyling(cellData.containingActiveShape, cellData.cell)} ${getCellSizeClass(cellData.gridColumnCount, cellData.gridRowCount)}`

  return (<div className={classes}></div>);
}

const getCellStyling = (containingShape: Shape | null, cellModel: CellModel): string => {
  if (!!containingShape) {
    return `${containingShape.shapeType} cell active-cell shadow ${cellModel.clearing$ ? 'clearing': ''}`;
  } else if (!!cellModel.inactiveShape) {
    return `${cellModel.inactiveShape.shapeType} cell inactive-occupied-cell ${cellModel.clearing$ ? 'clearing': ''}`;
  }

  return ''
}

const getCellSizeClass = (gridColumnCount: number, gridRowCount: number): string => {
  const size1 = 40;
  const size2 = 35;
  const size3 = 30;
  const size4 = 25;
  const cellHeightThreshhold: number = (window.innerHeight * .7) / gridRowCount;
  const cellWidthThreshhold: number = (window.innerWidth * .5) / gridColumnCount;
  const dimensionThreshhold = Math.min(cellHeightThreshhold, cellWidthThreshhold);

  if (dimensionThreshhold > size1) {
    return 'cell-size-1';
  }
  else if (dimensionThreshhold > size2) {
    return 'cell-size-2';
  }
  else if (dimensionThreshhold > size3) {
    return 'cell-size-3';
  }
  else if (dimensionThreshhold > size4) {
    return 'cell-size-4';
  }

  return 'cell-size-5';
}

export default Cell;