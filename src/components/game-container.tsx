import React from "react";
import Game from "../services/game";
import './game-container.css';
import Grid from "./grid";
import { DisplayType } from "../models/display-type";
import { ToggleDisplayType, StartGame, PauseGame, EndGame, ResetGame, IncrementLevel, ToggleInputType } from "../services/store/actions";
import DisplayPanel from "./display-panel";

function GameContainer(props: { game: Game }) {
  const { game } = props;

  const stateData = game.setComponentGameStateListener(gameState => {
    return {
      displayType: gameState.displayType,
      inputType: gameState.inputType,
      grid: gameState.grid,
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
          <DisplayPanel game={game} />
        </div>
        <div>
          User Controls Here
        </div>
        <div>InputType: {stateData.inputType}</div>

        <button onClick={() => props.game.dispatch(new ToggleInputType())}>Toggle Input Type</button>
        <button onClick={() => props.game.dispatch(new ToggleDisplayType())}>Toggle Display Type</button>
        <button onClick={(event: any) => { event.currentTarget.blur(); props.game.dispatch(new StartGame()); }}>Start</button>
        <button onClick={() => props.game.dispatch(new PauseGame())}>Pause</button>
        <button onClick={() => props.game.dispatch(new EndGame())}>End</button>
        <button onClick={() => props.game.dispatch(new ResetGame())}>Reset Game</button>
        <button onClick={() => props.game.dispatch(new IncrementLevel())}>Increment Level</button>
        <button onClick={() => console.log(stateData.grid)}>Print Grid</button>
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