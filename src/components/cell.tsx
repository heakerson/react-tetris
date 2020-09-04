import React from "react";
import Game from "../services/game";
import './cell.css';
import { Shape } from "../models/shape";
import { Cell as CellModel } from "../models/cell";

function Cell(props: { game: Game, rowIndex: number, columnIndex: number }) {
  const { rowIndex, columnIndex, game } = props;

  const containingActiveShape = game.setComponentGameStateListener(gameState => {
    const { activeShape } = gameState.grid;
    return activeShape && activeShape.containsCellAt(rowIndex, columnIndex) ? activeShape : null;
  });

  const cellModel = game.setComponentGameStateListener(gameState => gameState.grid.getCell(rowIndex, columnIndex));

  const classes = `${getCellColor(rowIndex, columnIndex, containingActiveShape, cellModel)} ${getCellSizeClass()}`

  return (
    <div className={classes}></div>
  );
}

const getCellColor = (rowIndex: number, columnIndex: number, containingShape: Shape | null, cellModel: CellModel): string => {
  const rowEven = rowIndex % 2 === 0;
  const colEven = columnIndex % 2 === 0;

  if (!!containingShape) {
    return `${containingShape.shapeType} active-cell`;
  } else if (!!cellModel.inactiveShape) {
    return `${cellModel.inactiveShape.shapeType} inactive-occupied-cell`;
  }
  return ''
}

const getCellSizeClass = (): string => {
  return 'cell-size-1';
}

export default Cell;