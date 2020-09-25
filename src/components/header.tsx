import React from "react";
import { AppBar, Toolbar, Typography, IconButton, makeStyles, Menu, MenuItem } from "@material-ui/core";
import { NavLink, useHistory } from "react-router-dom";
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import './header.css';
import { DisplayType } from "../models/display-type";
import Game from "../services/game";
import { RouteData } from "../models/route-data";

function Header(props: { game: Game }) {
  const classes = getStyles();
  const { game } = props;
  const displayType = game.setComponentGameStateListener(gameState => gameState.displayType);
  const history = useHistory();
  const [ anchorEl, setAnchorEl ] = React.useState<null | HTMLElement>(null);
  const routes = game.setComponentGameStateListener(gameState => gameState.routes);

  const getLinkContent = (route: RouteData) => {
    return !route.iconComponent ? route.title : (
      <IconButton color="inherit" aria-label="menu">
        <route.iconComponent />
      </IconButton>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar color="primary">
        {getHamburgerMenu(displayType, classes, anchorEl, setAnchorEl, history, routes)}
        <Typography variant="h3"><span className='tetris-header-text'>TETRIS</span></Typography>

        <Typography variant="h5" className={classes.buttonRow}>
          {routes.map((route: RouteData) => (
            displayType === DisplayType.Desktop &&
            <NavLink key={route.path} exact={true} className={route.className} activeClassName='active-nav glow-text-white' to={route.path}>
              {getLinkContent(route)}
            </NavLink>
          ))}
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
        <IconButton color="inherit" className={styles.hamburger} aria-label="menu" aria-controls="header-menu" aria-haspopup="true" onClick={handleClick}>
          <MenuRoundedIcon fontSize="large"/>
        </IconButton>
        <Menu id="header-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
          {routes.map(route => <MenuItem key={route.path} onClick={() => { history.push(route.path); handleClose(); }}>{route.title}</MenuItem>)}
        </Menu>
      </div>
    )
  } else {
    return null;
  }
}

export default Header;