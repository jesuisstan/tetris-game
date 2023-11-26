import { useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import * as colors from '../../styles/tetris-colors';
import * as MUI from '../../styles/MUIstyles';

const MenuDrawer = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      PaperProps={{
        style: {
          backgroundColor: colors.TETRIS_BLUE_TRANS,
          minWidth: '200px'
        }
      }}
      anchor="left"
      open={open}
      onClose={handleDrawerToggle}
    >
      <List sx={{ color: colors.TETRIS_BLACK }}>
        <ListItem
          onClick={() => {
            navigate('/');
            setOpen(false);
          }}
        >
          <ListItemText primary="Home" disableTypography sx={MUI.burgerItem} />
        </ListItem>
        <ListItem
          onClick={() => {
            navigate('/game');
            setOpen(false);
          }}
        >
          <ListItemText
            primary="Tetris game"
            disableTypography
            sx={MUI.burgerItem}
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default MenuDrawer;
