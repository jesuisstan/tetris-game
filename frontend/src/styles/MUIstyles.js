import * as colors from './tetris-colors';
import { createTheme } from '@mui/material';

export const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, sans-serif'
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
  fontFamily: 'Montserrat, sans-serif',
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
  bgcolor: colors.TETRIS_ORANGE,
  transition: 'background-color 0.2s, color 0.2s ease-in-out',
  ':hover': {
    color: colors.TETRIS_WHITE,
    bgcolor: colors.TETRIS_BLACK
  }
};

export const LoadButton = {
  fontFamily: '"Montserrat", sans-serif',
  fontWeight: 'bold',
  minWidth: 125,
  borderRadius: '90px',
  backgroundColor: colors.TETRIS_ORANGE,
  color: colors.TETRIS_BLACK,
  transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
  ':hover': {
    color: colors.TETRIS_WHITE,
    bgcolor: colors.TETRIS_BLACK
  }
};

export const burgerItem = {
  transition: 'transform 0.5s ease-in-out, color 0.2s ease-out',
  fontWeight: '500',
  letterSpacing: '0.02857em',
  ':hover': {
    color: colors.TETRIS_WHITE,
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
