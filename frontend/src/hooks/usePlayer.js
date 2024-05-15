import { useState, useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { emitSocketEvent } from '../store/socket-slice';

const buildPlayer = (dispatch, roomName, initialTetrominoes, popTetromino) => {
  const tetromino = popTetromino(); // Pop a tetromino from the array

  if (initialTetrominoes.length === 4) {
    dispatch(
      emitSocketEvent({
        eventName: 'get_tetrominoes',
        data: { roomName: roomName }
      })
    );
  }

  return {
    collided: false,
    isFastDropping: false,
    position: { row: 0, column: 4 },
    tetrominoes: initialTetrominoes,
    tetromino
  };
};

export const usePlayer = (roomName, initialTetrominoes, popTetromino) => {
  const dispatch = useDispatch();
  const [player, setPlayer] = useState(() =>
    buildPlayer(dispatch, roomName, initialTetrominoes, popTetromino)
  );

  const resetPlayer = useCallback(() => {
    setPlayer((prev) =>
      buildPlayer(dispatch, roomName, [...initialTetrominoes], popTetromino)
    ); // Pass a copy of initialTetrominoes
  }, [roomName, initialTetrominoes]);

  return [player, setPlayer, resetPlayer];
};
