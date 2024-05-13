import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Tetris from './Tetris';
import Messenger from './Messenger';
import { useGameOver } from '../../hooks/useGameOver';
import { errorAlert } from '../../utils/alerts';
import { createTetrominoes } from '../../utils/tetrominoes';
import TetrisLoader from '../UI/TetrisLoader';
import MagicButton from '../UI/MagicButton';
import TetrisConfetti from '../UI/TetrisConfetti';
import Rules from './Rules';

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
  const { room, player_name } = useParams();
  const nickname = useSelector((state) => state.user)?.nickname;
  const socketId = getSocket().id;
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState({});
  const [pending, setPending] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [messages, setMessages] = useState([]);
  const [losers, setLosers] = useState([]);
  const [gameOver, setGameOver, resetGameOver] = useGameOver();
  const [tetrominoes, setTetrominoes] = useState([]);
  const popTetromino = () => tetrominoes.pop();

  const start = () => {
    setShowConfetti(false);
    emitEvent('start_game', { roomName: room });
  };

  // check the presence of a room in case user enters with a link:
  useEffect(() => {
    const checkRoom = async () => {
      try {
        let res = await checkRoomPresence(room);
        if (res?.presence === false) {
          errorAlert('No such a room exists');
          navigate('/lobby');
        }
      } catch (error) {
        errorAlert('Something went wrong while checking room presence');
        console.log('Error:', error); // todo delete
        navigate('/lobby');
      }
    };

    checkRoom();
  }, [room, navigate]);

  // handling chat messaging:
  useEffect(() => {
    const handleNewMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
      if (data.type === 'gameOver') {
        setLosers((prev) => [...prev, data.nickname]);
      }
      if (data.type === 'winner') {
        if (data.nickname === nickname) setShowConfetti(true);
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
    if (room) emitEvent('join_room', { roomName: room });

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
      setShowConfetti(false);
      setLoading(true);
      setTimeout(() => {
        setTetrominoes(createTetrominoes(data));
        setPending(false);
        setLosers([]);
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

  return (
    <div style={{ marginTop: '21px' }}>
      <TetrisConfetti show={showConfetti} setShow={setShowConfetti} />
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
              <div className={styles.infoBlock}>
                {roomData.mode === 'competition' && (
                  <Messenger messages={messages} />
                )}
                <Rules />
              </div>
            </div>
          )}
          <div className={gameOver && pending ? styles.blurContent : ''}>
            {(!gameOver || (gameOver && pending)) && !loading && (
              <Tetris
                nickname={nickname}
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
