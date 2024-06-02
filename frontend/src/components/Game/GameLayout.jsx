import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import {
  emitSocketEvent,
  listenSocketEvent,
  stopListeningSocketEvent
} from '../../store/socket-slice';
import { checkRoomPresence } from '../../utils/check-room-presence';

import Tetris from './Tetris';
import Messenger from './Messenger';
import { useGameOver } from '../../hooks/useGameOver';
import { errorAlert } from '../../utils/alerts';
import { createTetrominoes } from '../../utils/tetrominoes';
import TetrisLoader from '../UI/TetrisLoader';
import MagicButton from '../UI/MagicButton';
import TetrisConfetti from '../UI/TetrisConfetti';
import Rules from './Rules';
import FloatingButtonLeave from '../UI/FloatingButtonLeave';
import FloatingButtonQuit from '../UI/FloatingButtonQuit';
import FloatingButtonBlur from '../UI/FloatingButtonBlur';

import styles from '../../styles/game-layout.module.css';

const GameLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { room, player_name } = useParams();
  const nickname = useSelector((state) => state.user)?.nickname;
  const socketId = useSelector((state) => state.socket.socket).id;
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState({});
  const [pending, setPending] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [messages, setMessages] = useState([]);
  const [losers, setLosers] = useState([]);
  const [gameOver, setGameOver, resetGameOver] = useGameOver();
  const [tetrominoes, setTetrominoes] = useState([]);
  const [unBlur, setUnBlur] = useState(false);
  const popTetromino = () => tetrominoes.pop();

  const start = () => {
    setShowConfetti(false);
    dispatch(
      emitSocketEvent({ eventName: 'start_game', data: { roomName: room } })
    );
  };

  // check the presence of a room in case user enters with a link:
  useEffect(() => {
    const checkRoom = async () => {
      try {
        let res = await checkRoomPresence(room, dispatch);
        if (res?.presence === false) {
          errorAlert('Room not found');
          navigate('/lobby');
        }
      } catch (error) {
        errorAlert('Something went wrong while checking room presence');
        navigate('/lobby');
      }
    };

    if (player_name !== nickname) {
      errorAlert('Incorrect link. Please, enter the game from the lobby.');
      navigate('/lobby');
    } else {
      checkRoom();
    }
  }, [room, navigate]);

  // handling chat messaging:
  useEffect(() => {
    const handleNewMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      if (data.type === 'gameOver') {
        setLosers((prev) => [...prev, data.nickname]);
      }
      if (data.type === 'leave') {
        setLosers((prev) => [...prev, data.nickname]);
      }
      if (data.type === 'winner') {
        setPending(true);
        if (data.nickname === nickname) setShowConfetti(true);
      }
    };

    if (player_name === nickname)
      dispatch(
        listenSocketEvent({ eventName: 'chat', callback: handleNewMessage })
      );

    return () => {
      dispatch(stopListeningSocketEvent({ eventName: 'chat', callback: null }));
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
    if (room && player_name === nickname) {
      dispatch(
        emitSocketEvent({ eventName: 'join_room', data: { roomName: room } })
      );

      dispatch(
        listenSocketEvent({
          eventName: 'welcome_to_the_room',
          callback: (roomData) => {
            setRoomData(roomData);
            setLoading(false);
          }
        })
      );

      dispatch(
        listenSocketEvent({
          eventName: 'update_room_data',
          callback: (data) => {
            setRoomData(data);
          }
        })
      );

      dispatch(
        listenSocketEvent({
          eventName: 'join_denied',
          callback: (data) => {
            setLoading(false);
            errorAlert(data?.message ?? 'Something went wrong');
            setTimeout(() => {
              navigate('/lobby');
            }, 500);
          }
        })
      );

      dispatch(
        listenSocketEvent({
          eventName: 'new_tetrominoes',
          callback: (data) => {
            setTetrominoes((prevTetrominoes) => [
              ...createTetrominoes(data),
              ...prevTetrominoes
            ]);
          }
        })
      );

      dispatch(
        listenSocketEvent({
          eventName: 'game_started',
          callback: (data) => {
            setShowConfetti(false);
            setLoading(true);
            setTimeout(() => {
              setTetrominoes(createTetrominoes(data));
              setPending(false);
              setUnBlur(false);
              setLosers([]);
              if (gameOver) {
                resetGameOver();
              }
              setLoading(false);
            }, [1000]);
          }
        })
      );

      dispatch(
        listenSocketEvent({
          eventName: 'game_start_error',
          callback: (data) => {
            setShowConfetti(false);
            setLoading(true);
            errorAlert(data.message);
            navigate('/lobby');
          }
        })
      );
    }

    return () => {
      // Clean up event listener when component unmounts
      dispatch(
        stopListeningSocketEvent({ eventName: 'game_started', callback: null })
      );
      dispatch(
        stopListeningSocketEvent({
          eventName: 'new_tetrominoes',
          callback: null
        })
      );
      dispatch(
        stopListeningSocketEvent({ eventName: 'join_denied', callback: null })
      );
      dispatch(
        stopListeningSocketEvent({
          eventName: 'update_room_data',
          callback: null
        })
      );
      dispatch(
        stopListeningSocketEvent({
          eventName: 'welcome_to_the_room',
          callback: null
        })
      );
      dispatch(
        stopListeningSocketEvent({
          eventName: 'game_start_error',
          callback: null
        })
      );
      dispatch(emitSocketEvent({ eventName: 'leave_room', data: null }));
    };
  }, []);

  const handleLeave = () => {
    dispatch(
      emitSocketEvent({
        eventName: 'game_over',
        data: {
          roomName: roomData?.name,
          roomAdmin: roomData?.admin?.socketId
        }
      })
    );
    navigate('/lobby');
  };

  const handleQuit = () => {
    dispatch(
      emitSocketEvent({
        eventName: 'game_over',
        data: {
          roomName: roomData?.name,
          roomAdmin: roomData?.admin?.socketId
        }
      })
    );
  };

  return (
    <div style={{ marginTop: '21px' }} data-testid="game-layout">
      <TetrisConfetti show={showConfetti} setShow={setShowConfetti} />
      <FloatingButtonLeave onClick={handleLeave} />
      {pending && (
        <FloatingButtonBlur
          onClick={() => {
            setUnBlur(!unBlur);
          }}
        />
      )}
      {!gameOver && (
        <FloatingButtonQuit
          onClick={handleQuit}
          data-testid="floating-button-quit"
        />
      )}
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
                {roomData?.mode === 'competition' && (
                  <Messenger messages={messages} roomData={roomData} hidable />
                )}
                <Rules />
              </div>
            </div>
          )}
          <div
            className={gameOver && pending && !unBlur ? styles.blurContent : ''}
          >
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
