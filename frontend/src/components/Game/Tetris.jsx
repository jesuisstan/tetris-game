import { useEffect, useState } from 'react';
import { useBoard } from '../../hooks/useBoard';
import { useGameStats } from '../../hooks/useGameStats';
import { usePlayer } from '../../hooks/usePlayer';
import { useSelector } from 'react-redux';

import Messenger from './Messenger';
import Board from './Board';
import GameStats from './GameStats';
import Previews from './Previews';
import GameController from './GameController';
import {
  emitEvent,
  listenEvent,
  stopListeningEvent
} from '../../socket/socketMiddleware';

import styles from '../../styles/tetris-styles/tetris.module.css';
import TetrisLoader from '../UI/TetrisLoader';

const Tetris = ({
  roomName,
  roomMode,
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
    roomName,
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
      emitEvent('board_from_front', { board, roomName, nickname });
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

    return () => {
      // Clean up event listener when component unmounts
      stopListeningEvent('board_from_back', null);
    };
  }, [gameOver]);

  return (
    <div className={styles.tetrisMain}>
      <div className={styles.wrapper}>
        <div style={{ minWidth: '41vh', minHeight: '82vh' }}>
          <Board board={board} />
        </div>

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
      {roomMode === 'competition' && (
        <div className={styles.right}>
          <Messenger />

          {Object.keys(othersBoards).length === 0 ? (
            <TetrisLoader text="Loading observation bar..." />
          ) : (
            <div className={styles.observation}>
              <p>Observation:</p>
              <div className={styles.others}>
                {Object.entries(othersBoards).map(([playerName, board]) => (
                  <div key={playerName}>
                    <p
                      style={{
                        marginBottom: '7px',
                        color: 'var(--TETRIS_WHITE)'
                      }}
                    >
                      {playerName}
                    </p>
                    <div className={styles.eachOtherBoard}>
                      <Board board={board} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tetris;
