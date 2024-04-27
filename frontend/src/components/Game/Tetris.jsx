import { useBoard } from '../../hooks/useBoard';
import { useGameStats } from '../../hooks/useGameStats';
import { usePlayer } from '../../hooks/usePlayer';

import Board from './Board';
import GameStats from './GameStats';
import Previews from './Previews';
import GameController from './GameController';

import styles from '../../styles/tetris-styles/tetris.module.css';

const Tetris = ({room, rows, columns, gameOver, setGameOver, initialTetrominoes, popTetromino }) => {
  const [gameStats, addLinesCleared] = useGameStats();
  const [player, setPlayer, resetPlayer] = usePlayer(gameOver, room, initialTetrominoes, popTetromino);
  const [board, setBoard] = useBoard({
    rows,
    columns,
    player,
    resetPlayer,
    addLinesCleared
  });

  return (
    <div className={styles.tetrisMain}>
      <div className={styles.wrapper}>
        <Board board={board} />

        <div className={styles.infoBlock}>
          <GameStats gameStats={gameStats} />
          <Previews tetrominoes={player?.tetrominoes}/>
        </div>

        {!gameOver && <GameController
          board={board}
          gameStats={gameStats}
          player={player}
          setGameOver={setGameOver}
          setPlayer={setPlayer}
        />}
      </div>
    </div>
  );
};

export default Tetris;
