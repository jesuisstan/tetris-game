import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon
} from '@mui/material';
import * as colors from '../../styles/tetris-colors';
import * as MUI from '../../styles/MUIstyles';
import HomeIcon from '@mui/icons-material/Home';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

const MenuDrawer = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      PaperProps={{
        style: {
          backgroundColor: colors.TETRIS_RED_TRANS,
          minWidth: '200px'
        }
      }}
      anchor="left"
      open={open}
      onClose={handleDrawerToggle}
    >
      <List sx={{ color: colors.TETRIS_PINK }}>
        <ListItem
          onClick={() => {
            navigate('/');
            setOpen(false);
          }}
        >
          <ListItemButton sx={MUI.burgerItem}>
            <ListItemIcon>
              <HomeIcon sx={{ color: colors.TETRIS_WHITE }} />
            </ListItemIcon>
            <ListItemText primary="Home" disableTypography />
          </ListItemButton>
        </ListItem>
        <ListItem
          onClick={() => {
            navigate('/game');
            setOpen(false);
          }}
        >
          <ListItemButton sx={MUI.burgerItem}>
            <ListItemIcon>
              <VideogameAssetIcon sx={{ color: colors.TETRIS_WHITE }} />
            </ListItemIcon>
            <ListItemText primary="Tetris game" disableTypography />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default MenuDrawer;
