import React from "react";
import Game from "../services/game";
import './game-container.css';
import Grid from "./grid";
import { DisplayType } from "../models/display-type";
import { ToggleDisplayType } from "../services/store/actions";

function GameContainer(props: { game: Game }) {
  const { game } = props;
  const tickCount1 = game.setGameStateListener(gameState => gameState.tickCount);
  const tickCount2 = game.setGameStateListener(gameState => gameState.tickCount2);

  const stateData = game.setGameStateListener(gameState => {
    return {
      tickCount1: gameState.tickCount,
      tickCount2: gameState.tickCount2,
      displayType: gameState.displayType
    };
  });

  const classes = getGameContainerClasses(stateData.displayType);

  return (
    <div className={classes}>
      <Grid game={game} />
      <div className="flex-column flex-fill">
        <div>
          Next shape Here
        </div>
        <div>
          Scoreboard here
        </div>
        <div>
          User Controls Here
        </div>
        <div>Tick Count: {tickCount1}</div>
        <div>Tick Count2: {tickCount2}</div>
        <div>Tick Count: {stateData.tickCount1}</div>
        <div>Tick Count2: {stateData.tickCount2}</div>
        <button onClick={() => props.game.dispatch(new ToggleDisplayType())}>Toggle Display Type</button>
      </div>
    </div>
  );
}

const getGameContainerClasses = (displayType: DisplayType): string => {
  const alwaysHas = 'content-container-fill-parent game-container';
  if (displayType === DisplayType.Desktop) {
    return `${alwaysHas} flex-row m-auto`;
  } else {
    return `${alwaysHas} flex-column flex-align-center mb-auto`;
  }
}

export default GameContainer;