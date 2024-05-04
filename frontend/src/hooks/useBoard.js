import { useState, useEffect } from 'react';

import { buildBoard, nextBoard } from '../utils/board';

//import { listenEvent, stopListeningEvent } from '../socket/socketMiddleware';

export const useBoard = ({
  rows,
  columns,
  player,
  resetPlayer,
  addLinesCleared
}) => {
  const [board, setBoard] = useState(buildBoard({ rows, columns }));

  const penaltyRows = 1; // todo delete penalty Rows

  useEffect(() => {
    setBoard((previousBoard) =>
      nextBoard({
        board: previousBoard,
        player,
        resetPlayer,
        addLinesCleared,
        penaltyRows
      })
    );
  }, [player, resetPlayer, addLinesCleared]);

  return [board];
};
