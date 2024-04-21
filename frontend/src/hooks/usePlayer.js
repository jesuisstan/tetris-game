//import { useState, useEffect, useCallback } from 'react';
//import { randomTetromino, createTetrominoes } from '../utils/tetrominoes';

//import { emitEvent, listenEvent } from '../socket/socketMiddleware';

//const TETROMINOES_AMOUNT =
//  Number(process.env.REACT_APP_TETROMINOES_AMOUNT) || 20;

//let tetrominoes = [];

//const buildPlayer = (roomName, initialTetrominoes, previous) => {
//  if (previous) {
//    tetrominoes = [...previous.tetrominoes];

//    if (tetrominoes.length <= 4) {
//      emitEvent('get_tetrominoes', { roomName });
//    }
//  } else {
//    tetrominoes = initialTetrominoes.slice(); // Copy initial tetrominoes
//  }

//  const tetromino = tetrominoes.pop(); // Pop a tetromino from the array

//  return {
//    collided: false,
//    isFastDropping: false,
//    position: { row: 0, column: 4 },
//    tetrominoes,
//    tetromino
//  };
//};

//export const usePlayer = (roomName, initialTetrominoes) => {
//  const [player, setPlayer] = useState(() =>
//    buildPlayer(roomName, initialTetrominoes)
//  );

//  const resetPlayer = useCallback(() => {
//    setPlayer((prev) => buildPlayer(roomName, initialTetrominoes, prev));
//  }, [roomName, initialTetrominoes]);

//  return [player, setPlayer, resetPlayer];
//};


import { useState, useEffect, useCallback } from 'react';
import { randomTetromino, createTetrominoes } from '../utils/tetrominoes';

import { emitEvent, listenEvent } from '../socket/socketMiddleware';

const TETROMINOES_AMOUNT =
  Number(process.env.REACT_APP_TETROMINOES_AMOUNT) || 20;

const buildPlayer = (roomName, initialTetrominoes, popTetromino, previous) => {
  if (!previous) {
    initialTetrominoes.pop(); // Modify initialTetrominoes by popping an element
  }

  //const tetromino = initialTetrominoes.pop(); // Pop a tetromino from the array
  const tetromino = popTetromino(); // Pop a tetromino from the array
console.log('initialTetrominoes.length ??????????', initialTetrominoes.length )
  if (initialTetrominoes.length <= 4) {
console.log('GET', initialTetrominoes.length )

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

export const usePlayer = (roomName, initialTetrominoes, popTetromino) => {
  const [player, setPlayer] = useState(() =>
    buildPlayer(roomName, initialTetrominoes, popTetromino)
  );

  const resetPlayer = useCallback(() => {
    setPlayer((prev) => buildPlayer(roomName, [...initialTetrominoes],popTetromino, prev)); // Pass a copy of initialTetrominoes
  }, [roomName, initialTetrominoes]);
//console.log('initialTetrominoes LENGTH', initialTetrominoes.length)
  return [player, setPlayer, resetPlayer];
};
