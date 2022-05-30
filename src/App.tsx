import React from "react";
import Game from "./components/game/Game"
import Header from "./components/Header";
import { orange } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';

const App: React.FC = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: orange[500],
      },
    },
  });

  
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Header/>
        <Game/>
      </ThemeProvider>
    </div>
  );
}

export default App;
