import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import {Link, useLocation} from 'react-router-dom'

const pages = ['logout', 'projects'];

const NavBar = (props) => {
  const location = useLocation(); //CURRENT ROUTE

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <CloudCircleIcon sx={{ fontSize: 35 ,display: { xs: 'none', md: 'flex' }, mr: 0 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              ml: 2,
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 600,
              letterSpacing: '.05rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {/* LOGO */}
            {props.user.userID
              ?
              <div>Welcome, {props.user.username}</div>
              :
              <div>Please login or create a new account</div>
            }
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                
              }}
            >
              <MenuItem key="Logout" onClick={()=>props.setUser({userID: null, username: null})}>
                <Typography textAlign="center" sx={{color:"white"}}>
                      Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
          <CloudCircleIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {/* LOGO */}
          </Typography>
          <Box sx={{ flexDirection: 'row-reverse', flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

            
            {props.user.userID ? 
                <Button
                //component={Link} to={page}
                key="Logout"
                onClick={()=>props.setUser({userID: null, username: null})}
                sx={{ my: 2, color: 'white', display: 'block'}}
                >
                  Logout
                </Button>
             :
             <p></p>
            }
            

            
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavBar;

