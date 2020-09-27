import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import React from "react";
import { GameStatus } from "../models/game-status";
import { ShapePositionConfig } from "../models/shape-position-config";
import { ShapeType } from "../models/shape-type";
import Game from "../services/game";
import './next-shape-display.css';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { DisplayType } from "../models/display-type";

function NextShapeDisplay(props: { game: Game }) {
  const { game } = props;
  const { nextShape, gameStatus, displayType } = game.setComponentGameStateListener(state => {
    return {
      nextShape: state.nextShape,
      gameStatus: state.gameStatus,
      displayType: state.displayType
    }
  });

  const isMobile = displayType === DisplayType.Mobile;
  let buildRows: () => any = () => {};

  const nextShapeContainerDimensions = {
    minWidth: `${isMobile ? '' : game.shapeManager.getGreatestShapeWidth()*20 + 40}px`,
    height: `${isMobile ? '' : game.shapeManager.getGreatestShapeHeight()*20+10}px`
  }

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
            return <div key={`${rowIndex} ${colIndex}`} className={`${isMobile ? 'next-shape-cell-mobile' : 'next-shape-cell'} ${isOccupied ? `glow-border-${shapeType}` : 'transparent'}`}></div>
          })}
        </div>
      );
    }

    buildRows = () => rowCounter.map(rowIndex => buildRow(rowIndex, shapeType, shapeConfig));
  }

  return (
    <div className={`${isMobile ? 'next-shape-display-container-mobile' : 'next-shape-display-container'} content-container-fill-parent glow-border-white flex-column`}>
      <div className="glow-text-white">NEXT: </div>
      <div className="next-shape-container m-auto flex-column flex-align-center" 
        style={nextShapeContainerDimensions}>
        {gameStatus === GameStatus.Paused ? <FontAwesomeIcon icon={faBan} size={isMobile ? '3x' : '5x'} className='glow-border-fuschia ban-icon' /> : buildRows()}
      </div>
    </div>
  );
}

export default NextShapeDisplay;