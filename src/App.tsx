import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Header from './components/header';
import Game from './services/game';

const game = new Game();

function App() {
  const routes = game.setGameStateListener(state => state.routes);

  const theme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        main: '#ff00e6',
      },
      secondary: {
        main: '#00dbe3'
      },
    },
  });

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Header game={game} />
        {routes.map(route => <Route key={route.path} path={route.path} exact render={() => <route.component game={game} />} />)}
      </ThemeProvider>
    </Router>
  );
}

export default App;
