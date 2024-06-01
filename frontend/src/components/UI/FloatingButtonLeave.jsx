import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import LogoutIcon from '@mui/icons-material/Logout';

const FloatingButtonLeave = ({ onClick }) => {
  return (
    <Box
      data-testid="floating-button-leave"
      sx={{
        position: 'fixed',
        bottom: '42px',
        right: '42px',
        zIndex: 9999,
        color: 'var(--TETRIS_BLACK)',
        opacity: 0.8,
        animation: 'zoomIn 0.3s ease-in'
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

export default FloatingButtonLeave;
