import { useState, useCallback } from 'react';

import { emitEvent } from '../socket/socketMiddleware';

const buildPlayer = (roomName, initialTetrominoes, popTetromino) => {
  const tetromino = popTetromino(); // Pop a tetromino from the array

  if (initialTetrominoes.length === 4) {
    emitEvent('get_tetrominoes', { roomName });
  }

  return {
    collided: false,
    isFastDropping: false,
    position: { row: 0, column: 4 },
    tetrominoes: initialTetrominoes,
    tetromino
  };
};

export const usePlayer = (
  roomName,
  initialTetrominoes,
  popTetromino
) => {
  const [player, setPlayer] = useState(() =>
    buildPlayer(roomName, initialTetrominoes, popTetromino)
  );

  const resetPlayer = useCallback(() => {
    setPlayer((prev) =>
      buildPlayer(roomName, [...initialTetrominoes], popTetromino)
    ); // Pass a copy of initialTetrominoes
  }, [roomName, initialTetrominoes]);

  return [player, setPlayer, resetPlayer];
};
