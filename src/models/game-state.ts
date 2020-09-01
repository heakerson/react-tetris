import { DisplayType } from "./display-type";
import { GameStatus } from "./game-status";

export class GameState {
  displayType: DisplayType  = isMobile() ? DisplayType.Mobile : DisplayType.Desktop;
  gameStatus: GameStatus = GameStatus.Start;
  tickCount: number = 10;
  tickCount2: number = 25;
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};