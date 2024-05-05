import { useState, useEffect } from 'react';

import { buildBoard, nextBoard } from '../utils/board';

//import { listenEvent, stopListeningEvent } from '../socket/socketMiddleware';

export const useBoard = ({
  rows,
  columns,
  player,
  resetPlayer,
  addLinesCleared,
  penaltyRows,
  setPenaltyRows
}) => {
  const [board, setBoard] = useState(buildBoard({ rows, columns }));

  useEffect(() => {
    setBoard((previousBoard) =>
      nextBoard({
        board: previousBoard,
        player,
        resetPlayer,
        addLinesCleared,
        penaltyRows,
        setPenaltyRows
      })
    );
  }, [player, resetPlayer, addLinesCleared]);

  return [board];
};
