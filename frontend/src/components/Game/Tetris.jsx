import Board from './Board';
import GameStats from './GameStats';
import Previews from './Previews';
import GameController from './GameController';

import { useBoard } from '../../hooks/useBoard';
import { useGameStats } from '../../hooks/useGameStats';
import { usePlayer } from '../../hooks/usePlayer';

import styles from '../../styles/tetris-styles/tetris.module.css';

const Tetris = ({ rows, columns, setGameOver }) => {
  const [gameStats, addLinesCleared] = useGameStats();
  const [player, setPlayer, resetPlayer] = usePlayer();
  const [board, setBoard] = useBoard({
    rows,
    columns,
    player,
    resetPlayer,
    addLinesCleared
  });

  return (
    <div className={styles.tetris}>
      <GameStats gameStats={gameStats} />

      <Board board={board} />

      <Previews tetrominoes={player.tetrominoes} />

      <GameController
        board={board}
        gameStats={gameStats}
        player={player}
        setGameOver={setGameOver}
        setPlayer={setPlayer}
      />
    </div>
  );
};

export default Tetris;
