import React from "react";
import Game from "../services/game";
import './grid.css';
import _ from "lodash";
import Cell from "./cell";

const Grid = React.memo((props: { game: Game }) => {
  const stateData = props.game.setComponentGameStateListener(gameState => {
    return {
      gridWidth: gameState.gridWidth,
      gridHeight: gameState.gridHeight
    };
  });

  const columnCounter = _.range(stateData.gridWidth);
  const rowCounter = _.range(stateData.gridHeight).reverse();

  const buildRow = (rowIndex: number) => {
    return (
      <div id='grid' className="flex-row" key={`row-${rowIndex}`}>
        {columnCounter.map(colIndex => <Cell key={`col-${colIndex}-row-${rowIndex}`} game={props.game} rowIndex={rowIndex} columnIndex={colIndex} />)}
      </div>
    );
  }

  return (
    <div className="flex-column">
      <div className="top-bar shadow"></div>
      {rowCounter.map(rowIndex => buildRow(rowIndex))}
      <div className="bottom-bar shadow"></div>
    </div>
  );
});

export default Grid;