import React from "react";
import Game from "../services/game";
import './grid.css';
import _ from "lodash";
import Cell from "./cell";

function Grid(props: { game: Game }) {
  const dimensions = props.game.setComponentGameStateListener(gameState => {
    return {
      gridWidth: gameState.gridWidth,
      gridHeight: gameState.gridHeight
    };
  });

  const columnCounter = _.range(dimensions.gridWidth);
  const rowCounter = _.range(dimensions.gridHeight).reverse();

  const buildRow = (rowIndex: number) => {
    return (
      <div className="flex-row" key={`row-${rowIndex}`}>
        {columnCounter.map(colIndex => <Cell key={`col-${colIndex}-row-${rowIndex}`} game={props.game} rowIndex={rowIndex} columnIndex={colIndex} />)}
      </div>
    );
  }

  return (
    <div className="flex-column">
      {rowCounter.map(rowIndex => buildRow(rowIndex))}
    </div>
  );
}

export default Grid;