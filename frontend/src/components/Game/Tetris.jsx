import { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import {
  emitSocketEvent,
  listenSocketEvent,
  stopListeningSocketEvent
} from '../../store/socket-slice';

import { useBoard } from '../../hooks/useBoard';
import { useGameStats } from '../../hooks/useGameStats';
import { usePlayer } from '../../hooks/usePlayer';
import Messenger from './Messenger';
import Board from './Board';
import GameStats from './GameStats';
import Previews from './Previews';
import GameController from './GameController';
import TetrisLoader from '../UI/TetrisLoader';

import styles from '../../styles/tetris-styles/tetris.module.css';

const Tetris = ({
  nickname,
  roomData,
  rows,
  columns,
  gameOver,
  setGameOver,
  initialTetrominoes,
  popTetromino,
  messages,
  setPending,
  losers
}) => {
  const dispatch = useDispatch();
  const [othersBoards, setOthersBoards] = useState({});
  const [penaltyRows, setPenaltyRows] = useState(0);

  const [gameStats, addLinesCleared] = useGameStats(
    roomData.mode,
    roomData.name
  );
  const [player, setPlayer, resetPlayer] = usePlayer(
    roomData.name,
    initialTetrominoes,
    popTetromino
  );
  const [board] = useBoard({
    rows,
    columns,
    player,
    resetPlayer,
    addLinesCleared,
    penaltyRows
  });

  useEffect(() => {
    if (roomData.mode === 'competition') {
      if (!gameOver) {
        dispatch(
          emitSocketEvent({
            eventName: 'board_from_front',
            data: {
              board,
              roomName: roomData.name,
              nickname
            }
          })
        );
      }
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
      dispatch(
        listenSocketEvent({
          eventName: 'board_from_back',
          callback: handleGetBoard
        })
      );

      dispatch(
        listenSocketEvent({
          eventName: 'add_penalty',
          callback: (data) => {
            setPenaltyRows((prev) => prev + data.penaltyRows);
          }
        })
      );

      dispatch(
        listenSocketEvent({
          eventName: 'set_gameover',
          callback: () => {
            setGameOver(true);
            setPending(true);
          }
        })
      );
    }

    return () => {
      // Clean up event listener when component unmounts
      dispatch(
        stopListeningSocketEvent({
          eventName: 'board_from_back',
          callback: null
        })
      );
      dispatch(
        stopListeningSocketEvent({
          eventName: 'add_penalty',
          callback: null
        })
      );
      dispatch(
        stopListeningSocketEvent({
          eventName: 'set_gameover',
          callback: null
        })
      );
    };
  }, [gameOver]);

  return (
    <div className={styles.tetrisMain}>
      <div className={styles.wrapper}>
        <div className={styles.boardContainer}>
          <Board board={board} gameover={gameOver} />
        </div>

        <div className={styles.infoBlock}>
          <GameStats gameStats={gameStats} />
          <Previews tetrominoes={player?.tetrominoes} />
        </div>
        {!gameOver && (
          <GameController
            roomData={roomData}
            board={board}
            gameStats={gameStats}
            player={player}
            setPlayer={setPlayer}
          />
        )}
      </div>
      {roomData.mode === 'competition' && (
        <div className={styles.right}>
          <Messenger messages={messages} />

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
                      <Board
                        board={board}
                        gameover={losers?.includes(playerName)}
                      />
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
