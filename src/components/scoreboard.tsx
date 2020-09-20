import React, { useState } from "react";
import Game from "../services/game";
import './scoreboard.css';

function Scoreboard(props: { game: Game }) {
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

  const levelLabelClasses = `label ${levelUpdated ? 'glow-label' : ''}`;
  const levelClasses = `data ${levelUpdated ? 'glow-score' : ''}`;

  return (
    <div className="content-container-fill-parent scoreboard-container flex-column">
      <div className={levelLabelClasses}>LEVEL: </div>
      <div className={levelClasses}>{scoreboardData.level + 1}</div>
      <div className="label stat-spacer">SCORE: </div>
      <div className="data">{scoreboardData.score}</div>
      <div className="label stat-spacer">ROWS CLEARED: </div>
      <div className="data">{scoreboardData.rowsCleared}</div>
    </div>
  );
}

export default Scoreboard;