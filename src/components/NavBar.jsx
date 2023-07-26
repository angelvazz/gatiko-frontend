import React, { useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { Auth } from 'aws-amplify';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const [registerModalOpen, setRegisterModalOpen] = React.useState(false);
  const { user, setUser } = useContext(AuthContext);

  const toggleLoginModal = () => {
    setLoginModalOpen(!loginModalOpen);
  };

  const toggleRegisterModal = () => {
    setRegisterModalOpen(!registerModalOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
    handleClose();
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Logo
          </Typography>
          <div>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              {user
                ? [
                    <MenuItem key="logout" onClick={handleLogout}>
                      Logout
                    </MenuItem>,
                  ]
                : [
                    <MenuItem key="login" onClick={toggleLoginModal}>
                      Login
                    </MenuItem>,
                    <LoginModal
                      key="loginModal"
                      open={loginModalOpen}
                      handleClose={toggleLoginModal}
                    />,
                    <MenuItem key="signup" onClick={toggleRegisterModal}>
                      Signup
                    </MenuItem>,
                    <RegisterModal
                      key="registerModal"
                      open={registerModalOpen}
                      handleClose={toggleRegisterModal}
                    />,
                  ]}
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
