import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import GameGrid from './components/game-grid';
import Settings from './components/settings';
import Scores from './components/scores';
import HowTo from './components/how-to';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Header from './components/header';
import Game from './services/game';

function App() {
  const game = new Game();

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

        <Route path="/" exact render={() => <GameGrid game={game} />} />
        <Route path="/scores" exact render={() => <Scores game={game} />} />
        <Route path="/howto" exact render={() => <HowTo game={game} />} />
        <Route path="/settings" exact render={() => <Settings game={game} />} />
      </ThemeProvider>
    </Router>
  );
}

export default App;
