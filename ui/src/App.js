import * as React from 'react';
import logo from './logo.svg';
import NavBar from './muiAppBar';
import ProjectsPage from './ProjectsPage';
import {Route, Routes} from 'react-router-dom'
import GlobalStyles from "@mui/material/GlobalStyles";
import { useTheme, ThemeProvider, createTheme} from '@mui/material/styles';
import { Typography } from '@mui/material';
import Auth from './Auth';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: "#ff0000",
      contrastText: "#fff",
    },
  },
});


function App() {
  const [user, setUser] = React.useState({userID: null, username: null})
  return (
      <ThemeProvider theme={darkTheme}>
        <GlobalStyles
          styles={{
            color: "white",
            body: { backgroundColor: "#222222" }
          }}
        />
        <NavBar user={user} setUser={setUser}/>
          <Routes>
            <Route path="/" element={
              user.userID == null
              ?
              <Auth setUser={setUser}/>
              :
              <ProjectsPage user={user}/>
            }/>
          </Routes>     
      </ThemeProvider>
  );
}

export default App;
