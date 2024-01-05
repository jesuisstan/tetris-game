import { NavLink, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import MenuDrawer from './MenuDrawer';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuUI from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import * as utils from '../../utils/auth-handlers';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../store/user-slice';
import Divider from '@mui/material/Divider';

import * as colors from '../../styles/tetris-colors';
import styles from '../../styles/menu.module.css';

const Menu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  //const isUltraSmallScreen = useMediaQuery('(max-width:350px)');
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = (navigateTo, options) => {
    if (navigateTo !== undefined) {
      navigate(navigateTo, options);
    }
    setAnchorElUser(null);
  };

  const authenticate = async () => {
    if (user._id) {
      const userData = await utils.logout();
      dispatch(setUser(userData));
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className={styles.navbar}>
      {isSmallScreen ? (
        <IconButton
          sx={{ marginLeft: '42px' }}
          color="inherit"
          onClick={() => setMenuDrawerOpen(!menuDrawerOpen)}
        >
          <img
            src={require('../../assets/logo.png')}
            alt="tetris-logo"
            width={'42px'}
          />
        </IconButton>
      ) : (
        <div className={styles.left}>
          <NavLink to=".">Home</NavLink>
          <NavLink to="game">Play</NavLink>
        </div>
      )}
      <div className={styles.right}>
        <div className={styles.userData}>
          {!isSmallScreen && user.nickname}

          <Tooltip title="See profile data">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              {user.nickname ? (
                <Avatar
                  sx={{
                    bgcolor: colors.TETRIS_GREEN,
                    color: colors.TETRIS_BLACK,
                    fontSize: '16px'
                  }}
                >
                  {user.firstName[0]}
                  {user.lastName[0]}
                </Avatar>
              ) : (
                <Avatar
                  sx={{
                    bgcolor: colors.TETRIS_PINK,
                    color: colors.TETRIS_BLACK
                  }}
                  alt="ava"
                />
              )}
            </IconButton>
          </Tooltip>

          <MenuUI
            sx={{ mt: '42px' }}
            PaperProps={{
              style: {
                backgroundColor: colors.TETRIS_WHITE,
                opacity: '0.95'
              }
            }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
            open={Boolean(anchorElUser)}
            onClose={() => handleCloseUserMenu()}
          >
            {user.nickname && (
              <div>
                <MenuItem>
                  {user.firstName} {user.lastName}
                </MenuItem>
                <MenuItem>{user.email}</MenuItem>
                <Divider />
              </div>
            )}
            <MenuItem
              onClick={() => {
                authenticate();
                setAnchorElUser(null);
              }}
            >
              {user._id ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '15px'
                  }}
                >
                  <LogoutIcon />
                  Logout
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '15px'
                  }}
                >
                  <LoginIcon />
                  Login
                </div>
              )}
            </MenuItem>
          </MenuUI>
        </div>
      </div>
      <MenuDrawer open={menuDrawerOpen} setOpen={setMenuDrawerOpen} />
    </nav>
  );
};

export default Menu;
