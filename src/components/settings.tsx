import React from "react";
import Game from "../services/game";
import { GameState } from "../models/game-state";
import { DisplayType } from "../models/display-type";

function Settings(props: { game: Game }) {
  const toggleDisplayType = () => {
    props.game.updateGameState((gameState: GameState) => {
      return {
        ...gameState,
        displayType: gameState.displayType === DisplayType.Mobile ? DisplayType.Desktop : DisplayType.Mobile
      };
    });
  };
  
  return (
    <div>Settings!
      <button onClick={toggleDisplayType}>Toggle Display Type</button>
    </div>
  );
}

export default Settings;