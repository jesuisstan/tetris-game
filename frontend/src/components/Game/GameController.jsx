import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { emitSocketEvent } from '../../store/socket-slice';

import { Action, actionForKey, actionIsDrop } from '../../utils/input';
import { playerController } from '../../utils/player-controller';
import { useDropTime } from '../../hooks/useDropTime';
import { useInterval } from '../../hooks/useInterval';

import '../../styles/tetris-styles/game-controller.css';

const GameController = ({ roomData, board, gameStats, player, setPlayer }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropTime, pauseDropTime, resumeDropTime] = useDropTime({
    gameStats
  });
  const inputRef = useRef(null);

  const focusOnTetris = () => {
    // Ensure the input element retains focus
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useInterval(() => {
    handleInput({ action: Action.SlowDrop });
    focusOnTetris();
  }, dropTime);

  const onKeyUp = ({ code }) => {
    const action = actionForKey(code);
    if (actionIsDrop(action)) resumeDropTime();
  };

  const onKeyDown = ({ code }) => {
    const action = actionForKey(code);

    if (action === Action.Exit) {
      dispatch(
        emitSocketEvent({
          eventName: 'game_over',
          data: {
            roomName: roomData.name,
            roomAdmin: roomData.admin.socketId
          }
        })
      );
      navigate('/lobby');
    } else if (action === Action.Quit) {
      dispatch(
        emitSocketEvent({
          eventName: 'game_over',
          data: {
            roomName: roomData.name,
            roomAdmin: roomData.admin.socketId
          }
        })
      );
    } else {
      if (!dropTime) {
        return;
      }
      handleInput({ action });
    }
  };

  const handleInput = ({ action }) => {
    playerController({
      dispatch,
      action,
      board,
      player,
      setPlayer,
      roomData
    });
  };

  return (
    <div>
      <input
        ref={inputRef}
        className="GameController"
        type="text"
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        autoFocus
      />
    </div>
  );
};

export default GameController;
