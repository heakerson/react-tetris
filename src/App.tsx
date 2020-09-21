import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Header from './components/header';
import Game from './services/game';
import { DisplayType } from './models/display-type';
import { Paper, Theme, makeStyles, createStyles } from '@material-ui/core';

const game = new Game();

function App() {
  const stateData = game.setComponentGameStateListener(state => {
    return {
      routes: state.routes,
      displayType: state.displayType
    }
  });

  const contentClass = stateData.displayType === DisplayType.Mobile ? 'content-frame-mobile flex-column' : 'content-frame flex-column';

  const theme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        // main: '#ff00e6',
        main: '#ff0084'
      },
      secondary: {
        main: '#00dbe3'
      },
    },
  });

  const paperStyles = makeStyles((theme: Theme) =>
    createStyles({
      paper: {
        display: 'flex',
        flexGrow: 1
      },
    }),
  );

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className="app-container flex-column">
          <Header game={game} />

          <div className={contentClass}>
            <Paper elevation={3} className={paperStyles().paper}>
              {stateData.routes.map(route => <Route key={route.path} path={route.path} exact render={() => <route.component game={game} />} />)}
              <Route render={() => <Redirect to="/" />} />
            </Paper>
          </div>
        </div>

      </ThemeProvider>
    </Router>
  );
}

export default App;
