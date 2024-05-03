import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Tetris from './Tetris';
import Messenger from './Messenger';
import { useGameOver } from '../../hooks/useGameOver';
import errorAlert from '../../utils/error-alert';
import { createTetrominoes } from '../../utils/tetrominoes';
import { emitEvent, listenEvent } from '../../socket/socketMiddleware';
import TetrisLoader from '../UI/TetrisLoader';
import MagicButton from '../UI/MagicButton';

import styles from '../../styles/game-layout.module.css';

const GameLayout = () => {
  const navigate = useNavigate();
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

  const start = () => {
    emitEvent('start_game', { roomName });
  };

  //useEffect(() => {
  //  setTimeout(() => {
  //    setLoading(false);
  //  }, 1000);
  //}, []);

  useEffect(() => {
    if (roomName) emitEvent('join_room', { roomName });

    // Listen for welcoming event
    listenEvent('welcome_to_the_room', (roomData) => {
      setRoomData(roomData);
      console.log('roomData', roomData);
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
              {user.nickname === roomData?.admin?.nickname ? (
                <MagicButton
                  text="Start"
                  action={() => {
                    start();
                  }}
                />
              ) : (
                <TetrisLoader text="Awaiting the start" />
              )}
              <Messenger />
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
