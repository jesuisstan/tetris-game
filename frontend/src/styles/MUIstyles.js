import * as colors from './mapColors';
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
  bgcolor: colors.MAP_WHITE,
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
  color: colors.MAP_BLACK,
  bgcolor: colors.MAP_ORANGE,
  transition: 'background-color 0.2s, color 0.2s ease-in-out',
  ':hover': {
    color: colors.MAP_WHITE,
    bgcolor: colors.MAP_BLACK
  }
};

export const LoadButton = {
  fontFamily: '"Montserrat", sans-serif',
  fontWeight: 'bold',
  minWidth: 125,
  borderRadius: '90px',
  backgroundColor: colors.MAP_ORANGE,
  color: colors.MAP_BLACK,
  transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
  ':hover': {
    color: colors.MAP_WHITE,
    bgcolor: colors.MAP_BLACK
  }
};

export const burgerItem = {
  transition: 'transform 0.5s ease-in-out, color 0.2s ease-out',
  fontWeight: '500',
  letterSpacing: '0.02857em',
  ':hover': {
    color: colors.MAP_WHITE,
    cursor: 'pointer'
  }
};

export const selector = {
  transition: 'transform 0.5s ease-in-out, color 0.2s ease-out',
  m: 0.5,
  backgroundColor: 'whitesmoke',
  minWidth: 150,
  ':hover': {
    backgroundColor: colors.MAP_WHITE
  }
};
