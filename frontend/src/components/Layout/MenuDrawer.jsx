import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

import * as MUI from '../../styles/MUIstyles';

const MenuDrawer = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      sx={{ zIndex: '11112' }}
      PaperProps={{
        style: {
          backgroundColor: 'var(--TETRIS_WHITE)',
          opacity: '0.9',
          minWidth: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }
      }}
      anchor="left"
      open={open}
      onClose={handleDrawerToggle}
    >
      <List sx={{ color: 'var(--TETRIS_BLACK)' }}>
        <ListItem
          onClick={() => {
            navigate('/');
            setOpen(false);
          }}
        >
          <ListItemButton sx={MUI.burgerItem}>
            <ListItemIcon>
              <HomeIcon sx={{ color: 'var(--TETRIS_PINK)' }} />
            </ListItemIcon>
            <ListItemText primary="Home" disableTypography />
          </ListItemButton>
        </ListItem>
        <ListItem
          onClick={() => {
            navigate('/lobby');
            setOpen(false);
          }}
        >
          <ListItemButton sx={MUI.burgerItem}>
            <ListItemIcon>
              <VideogameAssetIcon sx={{ color: 'var(--TETRIS_PINK)' }} />
            </ListItemIcon>
            <ListItemText primary="Play" disableTypography />
          </ListItemButton>
        </ListItem>
      </List>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '42px'
        }}
      >
        {' '}
        {/* Add margin at the bottom */}
        <img
          src={require('../../assets/logo.png')}
          alt="tetris-logo"
          width={'42px'}
        />
      </div>
    </Drawer>
  );
};

export default MenuDrawer;
