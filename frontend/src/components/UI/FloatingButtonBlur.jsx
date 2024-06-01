import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import VisibilityIcon from '@mui/icons-material/Visibility';

const FloatingButtonBlur = ({ onClick }) => {
  return (
    <Box
      data-testid="floating-button-blur"
      sx={{
        position: 'fixed',
        bottom: '42px',
        right: '112px',
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
        title="Switch the blur"
      >
        <VisibilityIcon />
      </Fab>
    </Box>
  );
};

export default FloatingButtonBlur;
