import _ from "lodash";
import React from "react";
import { ShapePositionConfig } from "../models/shape-position-config";
import { ShapeType } from "../models/shape-type";
import Game from "../services/game";
import './next-shape-display.css';

function NextShapeDisplay(props: { game: Game }) {
  const { game } = props;
  const nextShape = game.setComponentGameStateListener(state => state.nextShape);
  let buildRows: () => any = () => {};

  if (nextShape) {
    const { shapeType, rotationPoint } = nextShape;
    const shapeConfig = game.shapeManager.getConfigFor(shapeType, rotationPoint);
    const columnCounter = _.range(shapeConfig.grid[0].length);
    const rowCounter = _.range(shapeConfig.grid.length);

    let buildRow = (rowIndex: number, shapeType: ShapeType, shapeConfig: ShapePositionConfig) => {
      return (
        <div className="flex-row" key={`row-${rowIndex}`}>
          {columnCounter.map(colIndex => {
            const isOccupied = shapeConfig.miniGridOccupiedAt(rowIndex, colIndex, shapeConfig.grid);
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
      <div className="next-shape-container m-auto flex-column">
        {buildRows()}
      </div>
    </div>
  );
}

export default NextShapeDisplay;