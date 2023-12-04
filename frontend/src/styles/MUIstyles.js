import * as colors from './tetris-colors';
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
  border: '0px solid #000',
  bgcolor: colors.TETRIS_WHITE,
  borderRadius: '4px',
  paddingBottom: '30px'
};

export const modalHeader = {
  fontFamily: '"Orbitron", sans-serif',
  fontSize: '1.2rem',
  letterSpacing: '0.02857em',
  textAlign: 'center',
  fontWeight: 'bold',
  paddingBottom: '18px'
};

export const modalClose = {
  position: 'absolute',
  top: 'calc(-1/4 * var(--IconButton-size))',
  right: 'calc(-1/4 * var(--IconButton-size))',
  boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
  borderRadius: '50%',
  color: colors.TETRIS_BLACK,
  bgcolor: colors.TETRIS_WHITE,
  transition: 'background-color 0.3s',
  ':hover': {
    bgcolor: colors.TETRIS_GREEN
  }
};

export const LoadButton = {
  fontFamily: '"Orbitron", sans-serif',
  fontWeight: 'bold',
  minWidth: 125,
  borderRadius: '90px',
  backgroundColor: colors.TETRIS_WHITE,
  color: colors.TETRIS_BLACK,
  transition: 'background-color 0.3s ease-in-out',
  ':hover': {
    bgcolor: colors.TETRIS_PINK
  }
};

export const burgerItem = {
  transition: 'transform 0.5s ease-in-out, color 0.2s ease-out',
  fontWeight: '700',
  letterSpacing: '0.02857em',
  ':hover': {
    color: colors.TETRIS_GREEN,
    cursor: 'pointer'
  }
};

export const selector = {
  transition: 'transform 0.5s ease-in-out, color 0.2s ease-out',
  m: 0.5,
  backgroundColor: 'whitesmoke',
  minWidth: 150,
  ':hover': {
    backgroundColor: colors.TETRIS_WHITE
  }
};
