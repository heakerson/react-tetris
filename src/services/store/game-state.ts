import { DisplayType } from "../../models/display-type";
import { GameStatus } from "../../models/game-status";
import { RouteData } from "../../models/route-data";
import classNames from "classnames";
import SettingsIcon from '@material-ui/icons/Settings';
import GameContainer from "../../components/game-container";
import Scores from "../../components/scores";
import HowTo from "../../components/how-to";
import Settings from "../../components/settings";
import { Grid } from "../../models/grid";
import { Shape } from "../../models/shape";
import { InputType } from "../../models/input-type";

export class GameState {
  routes: RouteData[] = [
    { title: 'GAME', path: '/', component: GameContainer, className: 'nav-link' } as RouteData,
    { title: 'SCORES', path: '/scores', component: Scores, className: 'nav-link' } as RouteData,
    { title: 'HOW TO', path: '/howto', component: HowTo, className: 'nav-link' } as RouteData, 
    { title: 'SETTINGS', path: '/settings', component: Settings, iconComponent: SettingsIcon, className: classNames('nav-link', 'settings-icon') }  as RouteData
  ];
  keyboardInputKeys: any = {
    leftKey: 'ArrowLeft',
    rightKey: 'ArrowRight',
    downKey: 'ArrowDown',
    rotateClockwise: 'ArrowUp',
    rotateCounterClockwise: null,
    moveToBottomKey: ' '
  };
  displayType: DisplayType  = isMobile() ? DisplayType.Mobile : DisplayType.Desktop;
  inputType: InputType = isMobile() ? InputType.Touch : InputType.Keyboard;
  gameStatus: GameStatus = GameStatus.Start;
  gridWidth: number = 10;
  gridHeight: number = 20;
  level: number = 1;
  rowsCleared: number = 0;
  score: number = 0;
  grid: Grid = new Grid(this.gridWidth, this.gridHeight);
  nextShape?: Shape;
  tickCount: number = 0;
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};