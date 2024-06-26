import { useState, useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { emitSocketEvent } from '../store/socket-slice';

const buildGameStats = () => ({
  level: 1,
  linesCompleted: 0,
  linesPerLevel: 10,
  points: 0
});

export const useGameStats = (roomMode, roomName) => {
  const dispatch = useDispatch();
  const [gameStats, setGameStats] = useState(buildGameStats());

  const addLinesCleared = useCallback((lines) => {
    setGameStats((previous) => {
      const points = previous.points + lines * 100;
      const { linesPerLevel } = previous;
      const newLinesCompleted = previous.linesCompleted + lines;
      const level =
        newLinesCompleted >= linesPerLevel
          ? previous.level + 1
          : previous.level;
      const linesCompleted = newLinesCompleted % linesPerLevel;

      if (roomMode === 'competition') {
        if (lines >= 2) {
          const penaltyRows = lines - 1;
          dispatch(
            emitSocketEvent({
              eventName: 'penalty_condition',
              data: { roomName, penaltyRows }
            })
          );
        }
      }

      return {
        level,
        linesCompleted,
        linesPerLevel,
        points
      };
    }, []);
  }, []);

  return [gameStats, addLinesCleared];
};
