import React, { useEffect } from "react";
import Game from "../services/game";
import './grid.css';
import _ from "lodash";
import Cell from "./cell";
import { fromEvent } from "rxjs";
import { Subject } from "rxjs/internal/Subject";
import { takeUntil, filter, throttleTime, debounceTime } from "rxjs/operators";
import { MoveActiveShape } from "../services/store/actions";
import { MoveDirection } from "../models/move-direction";
import { InputType } from "../models/input-type";

const Grid = React.memo((props: { game: Game }) => {
  const takeUntil$ = new Subject();

  const stateData = props.game.setComponentGameStateListener(gameState => {
    return {
      gridWidth: gameState.gridWidth,
      gridHeight: gameState.gridHeight,
      grid: gameState.grid,
      keyboardInputKeys: gameState.keyboardInputKeys,
      inputType: gameState.inputType,
    };
  });

  useEffect(() => {
    if (stateData.inputType === InputType.Keyboard) {
      fromEvent(window, 'keydown')
        .pipe(
          takeUntil(takeUntil$),
          // debounceTime(50),
          // throttleTime(150),
          filter((event: any) => Object.values(stateData.keyboardInputKeys).includes(event.key))
        )
        .subscribe(event => {
          const keyboardKeys = stateData.keyboardInputKeys;
    
          switch(event.key) {
            case keyboardKeys.downKey:
              moveShape(MoveDirection.Down);
              break;
            case keyboardKeys.rotateKey:
              break;
            case keyboardKeys.leftKey:
              moveShape(MoveDirection.Left);
              break;
            case keyboardKeys.rightKey:
              moveShape(MoveDirection.Right);
              break;
            case keyboardKeys.moveToBottomKey:
              break;
          }
        });
    } else {
      alert('setting touch event!');
      fromEvent(window, 'touchstart')
        .pipe(
          takeUntil(takeUntil$),
          // throttleTime(150),
          // filter((event: any) => Object.values(stateData.keyboardInputKeys).includes(event.key))
        )
        .subscribe(event => {
        
        });
    }

    return () => { takeUntil$.next(); takeUntil$.complete(); }
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

  const moveShape = (direction: MoveDirection) => {
    const activeShape = stateData.grid.activeShape;

    if (activeShape) {
      const nextMoveCells = activeShape.getNextMoveCells(direction, stateData.grid)
      let valid = true;

      nextMoveCells.forEach(cell => {
        if (!cell) {
          valid = false;
        }
      });

      if (valid) {
        props.game.dispatch(new MoveActiveShape(nextMoveCells));
      }
    }
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