import React from "react";
import Game from "../services/game";
import { ToggleDisplayType } from "../services/store/actions";

function Settings(props: { game: Game }) {
  return (
    <div className="content-container">Settings!
      <button onClick={() => props.game.dispatch(new ToggleDisplayType())}>Toggle Display Type Action</button>
    </div>
  );
}

export default Settings;