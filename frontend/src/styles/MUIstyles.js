import { createTheme } from '@mui/material';

export const theme = createTheme({
  typography: {
    fontFamily: 'Orbitron, sans-serif'
  }
});

export const modalDialog = {
  width: 'auto',
  maxWidth: '442px',
  minWidth: '300px',
  border: `1px solid var(--TETRIS_WHITE)`,
  bgcolor: 'var(--TETRIS_BLACK)',
  borderRadius: '4px',
  paddingBottom: '30px'
};

export const modalHeader = {
  fontFamily: '"Orbitron", sans-serif',
  fontSize: '1.2rem',
  letterSpacing: '0.02857em',
  textAlign: 'center',
  fontWeight: 'bold',
  color: 'var(--TETRIS_PINK)'
};

export const modalClose = {
  position: 'absolute',
  top: 'calc(-1/4 * var(--IconButton-size))',
  right: 'calc(-1/4 * var(--IconButton-size))',
  boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
  borderRadius: '50%',
  color: 'var(--TETRIS_BLACK)',
  bgcolor: 'var(--TETRIS_WHITE)',
  transition: 'background-color 0.2s',
  ':hover': {
    bgcolor: 'var(--TETRIS_PINK)'
  }
};

export const LoadButton = {
  fontFamily: '"Orbitron", sans-serif',
  fontWeight: 'bold',
  minWidth: 125,
  borderRadius: '90px',
  backgroundColor: 'var(--TETRIS_WHITE)',
  color: 'var(--TETRIS_BLACK)',
  transition: 'background-color 0.2s ease-in-out',
  ':hover': {
    backgroundColor: 'var(--TETRIS_PINK)'
  },
  '& .MuiCircularProgress-circle': {
    color: 'var(--TETRIS_BLACK)'
  }
};

export const burgerItem = {
  transition: 'transform 0.5s ease-in-out, color 0.2s ease-out',
  fontWeight: '700',
  letterSpacing: '0.02857em',
  ':hover': {
    color: 'var(--TETRIS_GREEN)',
    cursor: 'pointer'
  }
};
