import { useEffect, useState } from 'react';
import { useBoard } from '../../hooks/useBoard';
import { useGameStats } from '../../hooks/useGameStats';
import { usePlayer } from '../../hooks/usePlayer';
import { useSelector } from 'react-redux';

import Board from './Board';
import GameStats from './GameStats';
import Previews from './Previews';
import GameController from './GameController';
import { emitEvent, listenEvent } from '../../socket/socketMiddleware';

import styles from '../../styles/tetris-styles/tetris.module.css';

const Tetris = ({
  room,
  rows,
  columns,
  gameOver,
  setGameOver,
  initialTetrominoes,
  popTetromino
}) => {
  const user = useSelector((state) => state.user);
  const nickname = user.nickname;

  const [othersBoards, setOthersBoards] = useState({});

  const [gameStats, addLinesCleared] = useGameStats();
  const [player, setPlayer, resetPlayer] = usePlayer(
    gameOver,
    room,
    initialTetrominoes,
    popTetromino
  );
  const [board, setBoard] = useBoard({
    rows,
    columns,
    player,
    resetPlayer,
    addLinesCleared
  });

  useEffect(() => {
    console.log('boards SEND event');
    if (!gameOver) {
      emitEvent('board_from_front', { board, room, nickname });
    }
  }, [gameOver, board]);

  useEffect(() => {
    const handleGetBoard = (data) => {
      setOthersBoards((prevBoards) => ({
        ...prevBoards,
        [data.playerName]: data.board
      }));
    };

    if (!gameOver) {
      listenEvent('board_from_back', handleGetBoard);
    }

    //return () => {
    //  // Clean up the event listener
    //  listenEvent('get_board', handleGetBoard);
    //};
  }, [gameOver]);

  return (
    <div className={styles.tetrisMain}>
      <div className={styles.wrapper}>
        <Board board={board} />

        <div className={styles.infoBlock}>
          <GameStats gameStats={gameStats} />
          <Previews tetrominoes={player?.tetrominoes} />
        </div>

        {!gameOver && (
          <GameController
            board={board}
            gameStats={gameStats}
            player={player}
            setGameOver={setGameOver}
            setPlayer={setPlayer}
          />
        )}
      </div>
      <div className={styles.others}>
        {Object.entries(othersBoards).map(([playerName, board]) => (
          <div key={playerName}>
            <p>{playerName}</p>
            <Board board={board} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tetris;
