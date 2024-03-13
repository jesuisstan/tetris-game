import Divider from '@mui/material/Divider';
import React from 'react';
//import * as color from './colorsPong';

const DeviderTetris = ({ orientation }) => (
  <Divider
    orientation={orientation}
    flexItem
    sx={{
      backgroundColor: 'var(--TETRIS_WHITE)',
      borderWidth: '1px'
    }}
  />
);

export default DeviderTetris;
