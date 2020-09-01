import React from "react";
import { AppBar, Toolbar, Typography, IconButton, makeStyles, Menu, MenuItem } from "@material-ui/core";
import { NavLink, useHistory } from "react-router-dom";
import SettingsIcon from '@material-ui/icons/Settings';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import classNames from "classnames";
import './header.css';
import { DisplayType } from "../models/display-type";
import Game from "../services/game";

function Header(props: { game: Game }) {
  const routes = [
    { title: 'GAME', path: '/', className: 'nav-link' },
    { title: 'SCORES', path: '/scores', className: 'nav-link' },
    { title: 'HOW TO', path: '/howto', className: 'nav-link' }, 
    { title: 'SETTINGS', path: '/settings', isIcon: true, className: classNames('nav-link', 'settings-icon') }
  ];
  const classes = getStyles();
  const { game } = props;
  const displayType = game.setGameStateListener(gameState => gameState.displayType);
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const getLinkContent = (route: any) => {
    return !route.isIcon ? route.title : (
      <IconButton color="inherit" aria-label="menu">
        <SettingsIcon />
      </IconButton>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar color="primary">
        {getHamburgerMenu(displayType, classes, anchorEl, setAnchorEl, history, routes)}
        <Typography variant="h3"><span className='tetris-header-text'>TETRIS</span></Typography>

        <Typography variant="h5" className={classes.buttonRow}>
          {routes.map(route => (
            displayType === DisplayType.Desktop &&
            <NavLink key={route.path} exact={true} className={route.className} activeClassName='active-nav' to={route.path}>
              {getLinkContent(route)}
            </NavLink>
          ))}

          {/* <button onClick={() => {props.game.updateGameState(gameState => {gameState.tickCount++; return gameState})}}>Update State</button>
          <button onClick={() => {props.game.updateGameState(gameState => {gameState.tickCount2++; return gameState})}}>Update State 2</button> */}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

const getStyles = makeStyles((theme) => ({
  buttonRow: {
    display: 'flex',
    flexGrow: 1,
    paddingLeft: 16,
    alignItems: 'center'
  },
  hamburger: {
    marginRight: 16
  }
}));

function getHamburgerMenu(displayType: DisplayType, styles: any, anchorEl: any, setAnchorEl: any, history: any, routes: any[]) {
  const handleClose = () => setAnchorEl(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);

  if (displayType === DisplayType.Mobile) {
    return  (
      <div>
        <IconButton color="inherit" aria-label="menu" aria-controls="header-menu" aria-haspopup="true" onClick={handleClick}>
          <MenuRoundedIcon fontSize="large" className={styles.hamburger}/>
        </IconButton>
        <Menu id="header-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
          {routes.map(route => {
            return <MenuItem key={route.path} onClick={() => { history.push(route.path); handleClose(); }}>{route.title}</MenuItem>
          })}
        </Menu>
      </div>
    )
  } else {
    return null;
  }
}

export default Header;