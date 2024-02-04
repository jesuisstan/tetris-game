import { Action, actionForKey, actionIsDrop } from '../../utils/input';
import { playerController } from '../../utils/player-controller';

import { useDropTime } from '../../hooks/useDropTime';
import { useInterval } from '../../hooks/useInterval';

import '../../styles/tetris-styles/game-controller.css';
import { useRef } from 'react';
import FocusButton from '../UI/FocusButton';

const GameController = ({
  board,
  gameStats,
  player,
  setGameOver,
  setPlayer
}) => {
  const [dropTime, pauseDropTime, resumeDropTime] = useDropTime({
    gameStats
  });

  useInterval(() => {
    handleInput({ action: Action.SlowDrop });
  }, dropTime);

  const onKeyUp = ({ code }) => {
    const action = actionForKey(code);
    if (actionIsDrop(action)) resumeDropTime();
  };

  const onKeyDown = ({ code }) => {
    const action = actionForKey(code);

    if (action === Action.Pause) {
      if (dropTime) {
        pauseDropTime();
      } else {
        resumeDropTime();
      }
    } else if (action === Action.Quit) {
      setGameOver(true);
    } else {
      if (actionIsDrop(action)) pauseDropTime();
      if (!dropTime) {
        return;
      }
      handleInput({ action });
    }
  };

  const handleInput = ({ action }) => {
    playerController({
      action,
      board,
      player,
      setPlayer,
      setGameOver
    });
  };

  const inputRef = useRef(null);

  const focusOnTetris = () => {
    // Ensure the input element retains focus
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div>
      <FocusButton title="Focus on tetris" onClick={focusOnTetris} />
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
