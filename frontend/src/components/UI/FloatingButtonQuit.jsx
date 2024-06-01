import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import BlockIcon from '@mui/icons-material/Block';

const FloatingButtonQuit = ({ onClick }) => {
  return (
    <Box
      data-testid="floating-button-quit"
      sx={{
        position: 'fixed',
        bottom: '112px',
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
        title="Quit the game round"
      >
        <BlockIcon />
      </Fab>
    </Box>
  );
};

export default FloatingButtonQuit;
