import { useState, useCallback } from 'react';

import { emitEvent } from '../socket/socketMiddleware';

const buildGameStats = () => ({
  level: 1,
  linesCompleted: 0,
  linesPerLevel: 10,
  points: 0
});

export const useGameStats = (roomMode, roomName) => {
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
        // todo delete this "if" and uncomment the next after debugging cuz we need n-1 penalty. not n (+ modify nextBoard foo)
        if (lines >= 1) {
          const penaltyRows = lines;
          emitEvent('penalty_condition', { roomName, penaltyRows });
        }

        //if (lines >= 2) {
        //  const penaltyRows = lines - 1;
        //  emitEvent('penalty_condition', { roomName, penaltyRows });
        //}
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
