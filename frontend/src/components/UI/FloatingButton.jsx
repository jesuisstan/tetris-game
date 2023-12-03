import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import HomeIcon from '@mui/icons-material/Home';
import * as colors from '../../styles/mapColors';

const FloatingButton = ({ onClick }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '50px',
        left: '94%',
        transform: 'translateX(-50%)',
        zIndex: 12000,
        color: colors.TETRIS_BLACK,
        opacity: 0.8,
        '&:hover': {
          color: colors.TETRIS_WHITE
        }
      }}
    >
      <Fab
        sx={{
          bgcolor: colors.TETRIS_PINK,
          '&:hover': {
            bgcolor: colors.TETRIS_BLACK
          }
        }}
        color="inherit"
        aria-label="edit"
        onClick={onClick}
        title="Return back to Paris"
      >
        <HomeIcon />
      </Fab>
    </Box>
  );
};

export default FloatingButton;
