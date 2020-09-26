import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import React from "react";
import { GameStatus } from "../models/game-status";
import { ShapePositionConfig } from "../models/shape-position-config";
import { ShapeType } from "../models/shape-type";
import Game from "../services/game";
import './next-shape-display.css';
import { faBan } from '@fortawesome/free-solid-svg-icons'

function NextShapeDisplay(props: { game: Game }) {
  const { game } = props;
  const nextShape = game.setComponentGameStateListener(state => state.nextShape);
  const gameStatus = game.setComponentGameStateListener(state => state.gameStatus);
  let buildRows: () => any = () => {};

  if (nextShape) {
    const { shapeType, rotationPoint } = nextShape;
    const shapeConfig = game.shapeManager.getConfigFor(shapeType, rotationPoint);
    const columnCounter = _.range(shapeConfig.widthMiniGrid);
    const rowCounter = _.range(shapeConfig.heightMiniGrid);

    let buildRow = (rowIndex: number, shapeType: ShapeType, shapeConfig: ShapePositionConfig) => {
      return (
        <div className="flex-row" key={`row-${rowIndex}`}>
          {columnCounter.map(colIndex => {
            const isOccupied = shapeConfig.miniGridOccupiedAt(rowIndex, colIndex);
            return <div key={`${rowIndex} ${colIndex}`} className={`next-shape-cell ${isOccupied ? `glow-border-${shapeType}` : 'transparent'}`}></div>
          })}
        </div>
      );
    }

    buildRows = () => rowCounter.map(rowIndex => buildRow(rowIndex, shapeType, shapeConfig));
  }

  return (
    <div className="content-container-fill-parent next-shape-display-container glow-border-white flex-column">
      <div className="glow-text-white">NEXT: </div>
      <div className="next-shape-container m-auto flex-column flex-align-center" 
        style={{ minWidth: `${game.shapeManager.getGreatestShapeWidth()*20 + 40}px`, height: `${game.shapeManager.getGreatestShapeHeight()*20+10}px`}}>
        {gameStatus === GameStatus.Paused ? <FontAwesomeIcon icon={faBan} size='5x' className='glow-border-fuschia ban-icon' /> : buildRows()}
      </div>
    </div>
  );
}

export default NextShapeDisplay;