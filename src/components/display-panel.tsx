import React, { useState } from "react";
import Game from "../services/game";
import NextShapeDisplay from "./next-shape-display";
import './display-panel.css';
import { GameStatus } from "../models/game-status";

function DisplayPanel(props: { game: Game }) {
  const displayData = props.game.setComponentGameStateListener(state => {
    return {
      level: state.currentLevel,
      score: state.score,
      rowsCleared: state.rowsCleared,
      gameStatus: state.gameStatus
    };
  });

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

  const levelLabelClasses = `glow-text-white stat-spacer ${levelUpdated ? 'glow-text-green-animation' : ''}`;
  const levelClasses = `data glow-text-fuschia ${levelUpdated ? 'glow-text-green-animation' : ''}`;

  return (
    <div className="content-container-fill-parent scoreboard-container inset-shadow flex-column">
      <NextShapeDisplay game={props.game} />
      <div className={levelLabelClasses}>LEVEL: </div>
      <div className={levelClasses}>{displayData.level + 1}</div>
      <div className="glow-text-white stat-spacer">SCORE: </div>
      <div className="data glow-text-fuschia">{displayData.score}</div>
      <div className="glow-text-white stat-spacer">ROWS CLEARED: </div>
      <div className="data glow-text-fuschia">{displayData.rowsCleared}</div>
      <button disabled={displayData.gameStatus === GameStatus.End} className="glow-border-green display-panel-button hover-cursor bg-green"><span className="glow-text-green">{getMainButtonText(displayData.gameStatus)}</span></button>
      <button className="glow-border-fuschia display-panel-button hover-cursor bg-fuschia"><span className="glow-text-fuschia">RESET</span></button>
    </div>
  );
}

export default DisplayPanel;