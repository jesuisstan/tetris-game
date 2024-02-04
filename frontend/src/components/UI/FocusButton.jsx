import React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { Crosshair } from 'lucide-react';

const FocusButton = ({ title, onClick }) => {
  return (
    <Box
      sx={{
        zIndex: 1,
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
        title={title ? title : ''}
      >
        <Crosshair />
      </Fab>
    </Box>
  );
};

export default FocusButton;
