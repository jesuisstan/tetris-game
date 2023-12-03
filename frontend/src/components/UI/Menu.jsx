import { NavLink, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuDrawer from './MenuDrawer';
import styles from '../../styles/Menu.module.css';
import LoadingButton from '@mui/lab/LoadingButton';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuUI from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import * as utils from '../../utils/auth-handlers';
import * as MUI from '../../styles/MUIstyles';
import * as colors from '../../styles/tetris-colors';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../store/user-slice';

const Menu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isUltraSmallScreen = useMediaQuery('(max-width:350px)');
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
    <div>
      <nav className={styles.navbar}>
        {isSmallScreen ? (
          <IconButton
            sx={{ marginLeft: '42px' }}
            color="inherit"
            onClick={() => setMenuDrawerOpen(!menuDrawerOpen)}
          >
            <MenuIcon style={{ fill: colors.TETRIS_WHITE }} />
          </IconButton>
        ) : (
          <div className={styles.left}>
            <NavLink to=".">Home</NavLink>
            <NavLink to="game">Tetris game</NavLink>
          </div>
        )}
        <div className={styles.right}>
          <div className={styles.userData}>
            {!isSmallScreen && user.nickname}
            {!isUltraSmallScreen && (
              <Tooltip title="See profile data">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt=""
                    src={
                      user.nickname
                        ? require('../../assets/loggedInUser.png')
                        : ''
                    }
                  />
                </IconButton>
              </Tooltip>
            )}
            {user.nickname && (
              <MenuUI
                sx={{ mt: '42px' }}
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
                <MenuItem>
                  {user.firstName} {user.lastName}
                </MenuItem>
                <MenuItem>{user.email}</MenuItem>
              </MenuUI>
            )}
          </div>
          <div>
            <LoadingButton
              startIcon={user._id ? <LogoutIcon /> : <LoginIcon />}
              variant="contained"
              color="inherit"
              sx={MUI.LoadButton}
              onClick={() => {
                authenticate();
              }}
            >
              {user._id ? 'Logout' : 'Login'}
            </LoadingButton>
          </div>
        </div>
        <MenuDrawer open={menuDrawerOpen} setOpen={setMenuDrawerOpen} />
      </nav>
    </div>
  );
};

export default Menu;
