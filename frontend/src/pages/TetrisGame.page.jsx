import { useNavigate } from 'react-router-dom';
import Tetris from '../components/Game/Tetris';
import { useGameOver } from '../hooks/useGameOver';
import LoadingButton from '@mui/lab/LoadingButton';

import styles from '../styles/tetris-styles/tetris.module.css';

const TetrisGame = ({ rows, columns }) => {
  const navigate = useNavigate();
  const [gameOver, setGameOver, resetGameOver] = useGameOver();

  const start = () => resetGameOver();

  return gameOver ? (
    <LoadingButton onClick={start}>Start</LoadingButton>
  ) : (
    <Tetris rows={rows} columns={columns} setGameOver={setGameOver} />
  );
};

export default TetrisGame;
