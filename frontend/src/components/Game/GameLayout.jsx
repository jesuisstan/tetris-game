import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Tetris from './Tetris';
import { useGameOver } from '../../hooks/useGameOver';
import LoadingButton from '@mui/lab/LoadingButton';

import * as MUI from '../../styles/MUIstyles';
import styles from '../../styles/tetris-styles/tetris.module.css';

const GameLayout = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [gameOver, setGameOver, resetGameOver] = useGameOver();

  const start = () => resetGameOver();

  return (
    <div style={{ marginTop: '21px' }}>
      {gameOver ? (
        <LoadingButton
          variant="contained"
          color="inherit"
          sx={MUI.LoadButton}
          onClick={start}
        >
          Play
        </LoadingButton>
      ) : (
        <Tetris rows={20} columns={10} setGameOver={setGameOver} />
      )}
    </div>
  );
};

export default GameLayout;
