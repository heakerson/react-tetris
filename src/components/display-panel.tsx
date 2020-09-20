import React, { useState } from "react";
import Game from "../services/game";
import NextShapeDisplay from "./next-shape-display";
import './display-panel.css';

function DisplayPanel(props: { game: Game }) {
  const scoreboardData = props.game.setComponentGameStateListener(state => {
    return {
      level: state.currentLevel,
      score: state.score,
      rowsCleared: state.rowsCleared,
    };
  });

  const [ levelData, setlevelData ] = useState({
    previousLevel: 0,
    updated: false
  });

  let levelUpdated = false;

  if (levelData.previousLevel !== scoreboardData.level && scoreboardData.level) {
    levelUpdated = true;

    setTimeout(() => {
      setlevelData({
        previousLevel: scoreboardData.level,
        updated: false
      });
    }, 3000);
  }

  const levelLabelClasses = `glow-text-white stat-spacer ${levelUpdated ? 'glow-text-green-animation' : ''}`;
  const levelClasses = `data glow-text-fuschia ${levelUpdated ? 'glow-text-green-animation' : ''}`;

  return (
    <div className="content-container-fill-parent scoreboard-container inset-shadow flex-column">
      <NextShapeDisplay game={props.game} />
      <div className={levelLabelClasses}>LEVEL: </div>
      <div className={levelClasses}>{scoreboardData.level + 1}</div>
      <div className="glow-text-white stat-spacer">SCORE: </div>
      <div className="data glow-text-fuschia">{scoreboardData.score}</div>
      <div className="glow-text-white stat-spacer">ROWS CLEARED: </div>
      <div className="data glow-text-fuschia">{scoreboardData.rowsCleared}</div>
    </div>
  );
}

export default DisplayPanel;