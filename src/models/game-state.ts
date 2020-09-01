import { DisplayType } from "./display-type";
import { GameStatus } from "./game-status";
import { RouteData } from "./route-data";
import classNames from "classnames";
import SettingsIcon from '@material-ui/icons/Settings';

export class GameState {
  routes: RouteData[] = [
    { title: 'GAME', path: '/', className: 'nav-link' } as RouteData,
    { title: 'SCORES', path: '/scores', className: 'nav-link' } as RouteData,
    { title: 'HOW TO', path: '/howto', className: 'nav-link' } as RouteData, 
    { title: 'SETTINGS', path: '/settings', iconComponent: SettingsIcon, className: classNames('nav-link', 'settings-icon') }  as RouteData
  ];
  displayType: DisplayType  = isMobile() ? DisplayType.Mobile : DisplayType.Desktop;
  gameStatus: GameStatus = GameStatus.Start;
  tickCount: number = 10;
  tickCount2: number = 25;
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};