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
    }
  });

  if (cellData.clearing$) {
    setTimeout(() => {
      cellData.clearing$?.next();
      cellData.clearing$?.complete();
    }, 1000);
  }

  const classes = `${getCellStyling(cellData.containingActiveShape, cellData.cell)} ${getCellSizeClass()}`

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

const getCellSizeClass = (): string => {
  return 'cell-size-1';
}

export default Cell;