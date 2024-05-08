import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Tetris from './Tetris';
import Messenger from './Messenger';
import { useGameOver } from '../../hooks/useGameOver';
import errorAlert from '../../utils/error-alert';
import { createTetrominoes } from '../../utils/tetrominoes';
import TetrisLoader from '../UI/TetrisLoader';
import MagicButton from '../UI/MagicButton';

import {
  getSocket,
  emitEvent,
  listenEvent,
  stopListeningEvent
} from '../../socket/socketMiddleware';

import styles from '../../styles/game-layout.module.css';

const GameLayout = () => {
  const navigate = useNavigate();
  const socketId = getSocket().id;
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState({});
  const user = useSelector((state) => state.user);
  const [tetrominoes, setTetrominoes] = useState([]);

  let roomPlusNickname = window.location.href.split('/')[5]; // Assuming window.location.href.split('/')[5] is 'zzz[TestUser]'
  const regex = /\[(.*?)\]/; // Regular expression to extract text within square brackets
  const matches = roomPlusNickname?.match(regex); // Match the regex against the string
  let roomName = '';
  if (matches && matches.length > 1) {
    roomName = roomPlusNickname.split('[')[0]; // Extract characters before '[' as room
  }

  const [gameOver, setGameOver, resetGameOver] = useGameOver();
  console.log('gameOver =====', gameOver); //todo delete

  const start = () => {
    emitEvent('start_game', { roomName });
  };

  useEffect(() => {
    if (roomData?.mode === 'solo') {
      if (roomData.admin.socketId !== socketId) {
        errorAlert('This is not your solo game');
        setTimeout(() => {
          navigate('/lobby');
        }, 300);
      }
    }

    if (roomData?.mode === 'competition') {
      if (roomData.state === false) {
        setGameOver(true);
      }
    }
  }, [roomData]);

  useEffect(() => {
    if (roomName) emitEvent('join_room', { roomName });

    // Listen for welcoming event
    listenEvent('welcome_to_the_room', (roomData) => {
      setRoomData(roomData);
      setLoading(false);
    });

    listenEvent('update_room_data', (data) => {
      setRoomData(data);
    });

    // Listen for "join_denied" events
    listenEvent('join_denied', (data) => {
      setLoading(false);
      errorAlert(data?.message ?? 'Something went wrong');
      setTimeout(() => {
        navigate('/lobby');
      }, 500);
    });

    listenEvent('new_tetrominoes', (data) => {
      setTetrominoes((prevTetrominoes) => [
        ...createTetrominoes(data),
        ...prevTetrominoes
      ]);
    });

    listenEvent('game_started', (data) => {
      setTetrominoes(createTetrominoes(data));

      if (gameOver) {
        resetGameOver();
      }
    });

    return () => {
      // Clean up event listener when component unmounts
      stopListeningEvent('game_started', null);
      stopListeningEvent('new_tetrominoes', null);
      stopListeningEvent('join_denied', null);
      stopListeningEvent('update_room_data', null);
      stopListeningEvent('welcome_to_the_room', null);
    };
  }, []);

  const popTetromino = () => tetrominoes.pop();

  return (
    <div style={{ marginTop: '21px' }}>
      {loading ? (
        <div className={styles.centered}>
          <TetrisLoader />
        </div>
      ) : (
        <div>
          {gameOver && !loading && (
            <div className={styles.floatingCentered}>
              {socketId === roomData?.admin?.socketId ? (
                <MagicButton
                  text="Start"
                  action={() => {
                    start();
                  }}
                />
              ) : (
                <TetrisLoader text="Awaiting the start" />
              )}
              {roomData.mode === 'competition' ? (
                <Messenger />
              ) : (
                <span style={{ color: 'var(--TETRIS_WHITE)' }}>
                  the solo game
                </span>
              )}
            </div>
          )}
          <div className={gameOver ? styles.blurContent : ''}>
            {!gameOver && (
              <Tetris
                roomName={roomName}
                roomMode={roomData.mode}
                rows={20}
                columns={10}
                gameOver={gameOver}
                setGameOver={setGameOver}
                initialTetrominoes={tetrominoes}
                popTetromino={popTetromino}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameLayout;
