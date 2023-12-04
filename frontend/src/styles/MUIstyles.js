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
  border: `1px solid ${colors.TETRIS_WHITE}`,
  bgcolor: colors.TETRIS_BLACK,
  borderRadius: '4px',
  paddingBottom: '30px'
};

export const modalHeader = {
  fontFamily: '"Orbitron", sans-serif',
  fontSize: '1.2rem',
  letterSpacing: '0.02857em',
  textAlign: 'center',
  fontWeight: 'bold',
  paddingBottom: '18px',
  color: colors.TETRIS_PINK
};

export const modalClose = {
  position: 'absolute',
  top: 'calc(-1/4 * var(--IconButton-size))',
  right: 'calc(-1/4 * var(--IconButton-size))',
  boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
  borderRadius: '50%',
  color: colors.TETRIS_BLACK,
  bgcolor: colors.TETRIS_WHITE,
  transition: 'background-color 0.2s',
  ':hover': {
    bgcolor: colors.TETRIS_PINK
  }
};

export const LoadButton = {
  fontFamily: '"Orbitron", sans-serif',
  fontWeight: 'bold',
  minWidth: 125,
  borderRadius: '90px',
  backgroundColor: colors.TETRIS_WHITE,
  color: colors.TETRIS_BLACK,
  transition: 'background-color 0.2s ease-in-out',
  ':hover': {
    backgroundColor: colors.TETRIS_PINK
  },
  '& .MuiCircularProgress-circle': {
    color: colors.TETRIS_WHITE
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
