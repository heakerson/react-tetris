import React from "react";
import Game from "../services/game";
import './grid.css';
import _ from "lodash";
import Cell from "./cell";

const Grid = React.memo((props: { game: Game }) => {
  const stateData = props.game.setComponentGameStateListener(gameState => {
    return {
      gridWidth: gameState.gridWidth,
      gridHeight: gameState.gridHeight,
      gridMessageJSX: gameState.grid.gridMessageJSX
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
    <div className="flex-column grid-container inset-shadow">

      <div hidden={!stateData.gridMessageJSX} className="grid-message-overlay flex-column">
        <div className="m-auto">
          {stateData.gridMessageJSX}
        </div>
      </div>

      <div className="glow-border-red"></div>
      {rowCounter.map(rowIndex => buildRow(rowIndex))}
      <div className="glow-border-green"></div>
    </div>
  );
});

export default Grid;