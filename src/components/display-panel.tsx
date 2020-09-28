import React, { useState } from "react";
import Game from "../services/game";
import NextShapeDisplay from "./next-shape-display";
import './display-panel.css';
import { GameStatus } from "../models/game-status";
import { PauseGame, ResetGame, StartGame } from "../services/store/actions";
import { DisplayType } from "../models/display-type";

function DisplayPanel(props: { game: Game }) {
  const displayData = props.game.setComponentGameStateListener(state => {
    return {
      level: state.currentLevel,
      score: state.score,
      rowsCleared: state.rowsCleared,
      gameStatus: state.gameStatus,
      displayType: state.displayType
    };
  });

  const isMobile = displayData.displayType === DisplayType.Mobile;

  const [ levelData, setlevelData ] = useState({
    previousLevel: 0,
    updated: false
  });

  let levelUpdated = false;

  if (levelData.previousLevel !== displayData.level && displayData.level) {
    levelUpdated = true;

    setTimeout(() => {
      setlevelData({
        previousLevel: displayData.level,
        updated: false
      });
    }, 3000);
  }

  const getMainButtonText = (gameStatus: GameStatus) => {
    switch (gameStatus) {
      case GameStatus.Start:
        return 'START';
      case GameStatus.Paused:
        return 'CONTINUE';
      default:
        return 'PAUSE';
    }
  }

  const mainButtonClicked = (gameStatus: GameStatus, event: any) => {
    event.currentTarget.blur();

    switch(gameStatus) {
      case GameStatus.Playing:
        props.game.dispatch(new PauseGame());
        break;
      case GameStatus.Start:
        props.game.setUserData(userData => {
          return {
            ...userData,
            gamesPlayed: userData.gamesPlayed + 1
          }
        })
        props.game.dispatch(new StartGame());
        break;
      default:
        props.game.dispatch(new StartGame());
        break;
    }
  }

  const levelLabelClasses = `glow-text-white ${isMobile ? 'stat-spacer-mobile' : 'stat-spacer'} ${levelUpdated ? 'glow-text-green-animation' : ''}`;
  const levelClasses = `data glow-text-fuschia ${levelUpdated ? 'glow-text-green-animation' : ''}`;

  return (
    <div className={`content-container-fill-parent scoreboard-container inset-shadow ${isMobile ? 'flex-row' : 'flex-column'}`}>
      <NextShapeDisplay game={props.game} />
      <div className={isMobile ? 'flex-column mobile-display' : ''}>
        <div className={levelLabelClasses}>LEVEL: </div>
        <div className={levelClasses}>{displayData.level + 1}</div>
        <div className={`glow-text-white ${isMobile ? 'stat-spacer-mobile' : 'stat-spacer'}`}>SCORE: </div>
        <div className="data glow-text-fuschia">{displayData.score}</div>
        <div className={`glow-text-white ${isMobile ? 'stat-spacer-mobile' : 'stat-spacer'}`}>{isMobile ? 'ROWS: ' : 'ROWS CLEARED: '}</div>
        <div className="data glow-text-fuschia">{displayData.rowsCleared}</div>
      </div>

      <div className='flex-column'>
        <button onClick={(event: any) => mainButtonClicked(displayData.gameStatus, event)} 
          disabled={displayData.gameStatus === GameStatus.End} id='mainButton'
          className={`glow-border-green display-panel-button hover-cursor bg-green ${isMobile ? 'mobile-display-panel-button' : ''}`}>
            <span className="glow-text-green">{getMainButtonText(displayData.gameStatus)}</span>
        </button>

        <button onClick={(event: any) => { event.currentTarget.blur(); props.game.dispatch(new ResetGame())}} 
          disabled={displayData.gameStatus === GameStatus.Start} id='resetButton'
          className={`glow-border-fuschia display-panel-button hover-cursor bg-fuschia ${isMobile ? 'mobile-display-panel-button' : ''}`}>
            <span className="glow-text-fuschia">RESET</span>
        </button>
      </div>
    </div>
  );
}

export default DisplayPanel;