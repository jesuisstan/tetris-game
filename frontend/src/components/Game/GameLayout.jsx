import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  stopListeningEvent,
  checkRoomPresence
} from '../../socket/socket-middleware';

import styles from '../../styles/game-layout.module.css';

const GameLayout = () => {
  const navigate = useNavigate();
  const socketId = getSocket().id;
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState({});
  const [tetrominoes, setTetrominoes] = useState([]);
  const [pending, setPending] = useState(false);

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

  // check the presence of a room in case user enters with a link:
  useEffect(() => {
    const checkRoom = async () => {
      try {
        let res = await checkRoomPresence(roomName);
        if (res?.presence === false) {
          errorAlert('No such a room exists');
          navigate('/lobby');
        }
      } catch (error) {
        errorAlert('Something went wrong while checking room presence');
        navigate('/lobby');
      }
    };

    checkRoom();
  }, [roomName]);

  // handling chat messaging:
  const [messages, setMessages] = useState([]);
  const [losers, setLosers] = useState([]);
  useEffect(() => {
    const handleNewMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
      if (data.type === "gameOver") {
        setLosers((prev) => [...prev, data.nickname]);
      }
    };

    listenEvent('chat', handleNewMessage);

    return () => {
      stopListeningEvent('chat', null);
    };
  }, []);

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
      console.log('update_room_data', data); // todo delete
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
      setLoading(true);
      setTimeout(() => {
        setTetrominoes(createTetrominoes(data));
        setPending(false);
        setLosers([])
        if (gameOver) {
          resetGameOver();
        }
        setLoading(false);
      }, [1000]);
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
  console.log(loading);
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
                <Messenger messages={messages} />
              ) : (
                <span style={{ color: 'var(--TETRIS_WHITE)' }}>
                  the new solo game
                </span>
              )}
            </div>
          )}
          <div className={gameOver && pending ? styles.blurContent : ''}>
            {(!gameOver || (gameOver && pending)) && !loading && (
              <Tetris
                roomData={roomData}
                rows={20}
                columns={10}
                gameOver={gameOver}
                setGameOver={setGameOver}
                initialTetrominoes={tetrominoes}
                popTetromino={popTetromino}
                messages={messages}
                setPending={setPending}
                losers={losers}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameLayout;
