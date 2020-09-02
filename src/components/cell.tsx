import React from "react";
import Game from "../services/game";
import './cell.css';

function Cell(props: { game: Game, rowIndex: number, columnIndex: number }) {
  const { rowIndex, columnIndex } = props;
  const classes = `${getCellColor(rowIndex, columnIndex)} ${getCellSizeClass()}`

  return (
    <div className={classes}></div>
  );
}

const getCellColor = (rowIndex: number, columnIndex: number): string => {
  const rowEven = rowIndex % 2 === 0;
  const colEven = columnIndex % 2 === 0;

  return rowEven ? (colEven ? 'color-1' : 'color-2') : (colEven ? 'color-2' : 'color-1');
}

const getCellSizeClass = (): string => {
  return 'cell-size-1';
}

export default Cell;