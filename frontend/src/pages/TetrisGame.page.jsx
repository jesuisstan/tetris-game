import { useNavigate } from 'react-router-dom';
import Tetris from '../components/Game/Tetris';
import { useGameOver } from '../hooks/useGameOver';
import LoadingButton from '@mui/lab/LoadingButton';

import * as MUI from '../styles/MUIstyles';
import styles from '../styles/tetris-styles/tetris.module.css';

const TetrisGame = ({ rows, columns }) => {
  const navigate = useNavigate();
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
        <Tetris rows={rows} columns={columns} setGameOver={setGameOver} />
      )}
    </div>
  );
};

export default TetrisGame;
