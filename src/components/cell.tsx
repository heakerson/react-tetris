import React from "react";
import Game from "../services/game";
import './cell.css';
import { Shape } from "../models/shape";
import { Cell as CellModel } from "../models/cell";
import { GameStatus } from "../models/game-status";
import { DisplayType } from "../models/display-type";

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
      gridRowCount: gameState.gridHeight,
      displayMode: gameState.displayType
    }
  });

  if (cellData.clearing$) {
    setTimeout(() => {
      cellData.clearing$?.next();
      cellData.clearing$?.complete();
    }, 1000);
  }

  const isMobile = cellData.displayMode === DisplayType.Mobile;
  const classes = `${getCellStyling(cellData.containingActiveShape, cellData.cell, cellData.gameStatus)} ${getCellSizeClass(cellData.gridColumnCount, cellData.gridRowCount, isMobile)}`;

  return (<div className={classes}></div>);
}

const getCellStyling = (containingShape: Shape | null, cellModel: CellModel, gameStatus: GameStatus): string => {
  if (gameStatus === GameStatus.Paused) {
    return `cell pause-cell-${Math.floor(Math.random() * Math.floor(7))}`;
  }
  else if (!!containingShape) {
    return `cell active-cell shadow glow-border-${containingShape.shapeType} ${cellModel.clearing$ ? 'clearing': ''}`;
  }
  else if (!!cellModel.inactiveShape) {
    return `${cellModel.inactiveShape.shapeType} cell inactive-occupied-cell ${cellModel.clearing$ ? 'clearing': ''}`;
  }

  return ''
}

const getCellSizeClass = (gridColumnCount: number, gridRowCount: number, isMobile: boolean): string => {
  const size1 = 40;
  const size2 = 35;
  const size3 = 30;
  const size4 = 25;
  const size5 = 20;
  const cellHeightThreshhold: number = (window.innerHeight * (isMobile ? .7 : .7)) / gridRowCount;
  const cellWidthThreshhold: number = (window.innerWidth * (isMobile ? .9 : .5)) / gridColumnCount;
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
  else if (dimensionThreshhold > size5) {
    return 'cell-size-5';
  }

  return 'cell-size-6';
}

export default Cell;