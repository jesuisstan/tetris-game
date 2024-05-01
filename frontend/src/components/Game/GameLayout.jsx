import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Tetris from './Tetris';
import { useGameOver } from '../../hooks/useGameOver';
import LoadingButton from '@mui/lab/LoadingButton';
import errorAlert from '../../utils/error-alert';
import { createTetrominoes } from '../../utils/tetrominoes';
import { emitEvent, listenEvent } from '../../socket/socketMiddleware';
import TetrisLoader from '../UI/TetrisLoader';
import MagicButton from '../UI/MagicButton';

import styles from '../../styles/game-layout.module.css';

const GameLayout = () => {
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [initialTetrominoes, setInitialTetrominoes] = useState([]);

  let roomPlusNickname = window.location.href.split('/')[5]; // Assuming window.location.href.split('/')[5] is 'zzz[TestUser]'
  const regex = /\[(.*?)\]/; // Regular expression to extract text within square brackets
  const matches = roomPlusNickname?.match(regex); // Match the regex against the string
  let roomName = '';
  if (matches && matches.length > 1) {
    roomName = roomPlusNickname.split('[')[0]; // Extract characters before '[' as room
  }

  const [gameOver, setGameOver, resetGameOver] = useGameOver();

  const start = () => {
    if (initialTetrominoes.length === 0) {
      emitEvent('get_tetrominoes', { roomName });
    }
  };

  //useEffect(() => {
  //  setTimeout(() => {
  //    setLoading(false);
  //  }, 1000);
  //}, []);

  useEffect(() => {
    if (roomName) emitEvent('join_room', { roomName }); // Emitting join_room event

    // Listen for welcoming event
    listenEvent('welcome_to_the_room', () => {
      setLoading(false);
      //navigate(roomURI); // Navigate after receiving acknowledgment
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
      setInitialTetrominoes((prevTetrominoes) => [
        ...createTetrominoes(data),
        ...prevTetrominoes
      ]);

      if (gameOver) {
        resetGameOver();
      }
    });
  }, []);

  const popTetromino = () => initialTetrominoes.pop();

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
              <MagicButton
                text="Start"
                action={() => {
                  start();
                }}
              />
              {/*<TetrisLoader text="Awaiting the start" />*/}
            </div>
          )}
          <div className={gameOver ? styles.blurContent : ''}>
            {!gameOver && (
              <Tetris
                room={roomName}
                rows={20}
                columns={10}
                gameOver={gameOver}
                setGameOver={setGameOver}
                initialTetrominoes={initialTetrominoes}
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
