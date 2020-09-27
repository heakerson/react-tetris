import React from "react";
import Game from "../services/game";
import './game-container.css';
import Grid from "./grid";
import { DisplayType } from "../models/display-type";
import { ToggleDisplayType, EndGame, IncrementLevel, ToggleInputType } from "../services/store/actions";
import DisplayPanel from "./display-panel";
import Draggable from "react-draggable";
import { GameStatus } from "../models/game-status";
import { faSyncAlt, faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputType } from "../models/input-type";

function GameContainer(props: { game: Game }) {
  const { game } = props;

  const stateData = game.setComponentGameStateListener(gameState => {
    return {
      displayType: gameState.displayType,
      inputType: gameState.inputType,
      grid: gameState.grid,
      gameStatus: gameState.gameStatus,
    };
  });

  const classes = getGameContainerClasses(stateData.displayType);
  const playing = stateData.gameStatus === GameStatus.Playing;
  const touchInput = stateData.inputType === InputType.Touch;

  return (
    <div className={classes}>
      {touchInput && <Draggable disabled={playing}>
        <div id='rotateButton' className='mobile-gameplay-button glow-border-blue glow-text-blue flex-column flex-align-center'>
          <FontAwesomeIcon icon={faSyncAlt} size='2x'/>
          {!playing && <div className="drag-text">DRAG ME</div>}
        </div>
      </Draggable>}

      {touchInput && <Draggable disabled={playing}>
        <div id='settleButton' className='mobile-gameplay-button glow-border-blue glow-text-blue flex-column flex-align-center'>
          <FontAwesomeIcon icon={faArrowAltCircleDown} size='2x'/>
          {!playing && <div className="drag-text">DRAG ME</div>}
        </div>
      </Draggable>}

      <Grid game={game} />
      <div className="flex-column flex-fill">
        <div>
          <DisplayPanel game={game} />
        </div>
        {/* <div>InputType: {stateData.inputType}</div>

        <button onClick={() => props.game.dispatch(new ToggleInputType())}>Toggle Input Type</button>
        <button onClick={() => props.game.dispatch(new ToggleDisplayType())}>Toggle Display Type</button>
        <button onClick={() => props.game.dispatch(new EndGame())}>End</button>
        <button onClick={() => props.game.dispatch(new IncrementLevel())}>Increment Level</button>
        <button onClick={() => console.log(stateData.grid)}>Print Grid</button> */}
      </div>
    </div>
  );
}

const getGameContainerClasses = (displayType: DisplayType): string => {
  const baseClasses = 'content-container-fill-parent';
  if (displayType === DisplayType.Desktop) {
    return `${baseClasses} flex-row m-auto game-container`;
  } else {
    return `${baseClasses} flex-column flex-align-center mb-auto mobile-game-container`;
  }
}

export default GameContainer;