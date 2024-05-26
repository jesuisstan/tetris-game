import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import LogoutIcon from '@mui/icons-material/Logout';

const FloatingButton = ({ onClick }) => {
  return (
    <Box
      data-testid="floating-button"
      sx={{
        position: 'fixed',
        bottom: '42px',
        right: '42px',
        zIndex: 9999,
        color: 'var(--TETRIS_BLACK)'
      }}
    >
      <Fab
        sx={{
          bgcolor: 'var(--TETRIS_WHITE)',
          '&:hover': {
            bgcolor: 'var(--TETRIS_PINK)'
          }
        }}
        color="inherit"
        aria-label="edit"
        onClick={onClick}
        title="Leave the room"
      >
        <LogoutIcon />
      </Fab>
    </Box>
  );
};

export default FloatingButton;
