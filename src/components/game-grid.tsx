import React from "react";
import Game from "../services/game";

function GameGrid(props: { game: Game }) {
  const { game } = props;
  const tickCount1 = game.setGameStateListener(gameState => gameState.tickCount);
  const tickCount2 = game.setGameStateListener(gameState => gameState.tickCount2);

  const combo = game.setGameStateListener(gameState => {
    return {
      tickCount1: gameState.tickCount,
      tickCount2: gameState.tickCount2
    };
  });

  return (
    <div>
      <div>GAME GRID</div>
      <div>Tick Count: {tickCount1}</div>
      <div>Tick Count2: {tickCount2}</div>
      <div>Tick Count: {combo.tickCount1}</div>
      <div>Tick Count2: {combo.tickCount2}</div>
    </div>
  );
}

export default GameGrid;