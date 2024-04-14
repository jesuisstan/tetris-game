import { useState, useEffect, useCallback } from 'react';
import { randomTetromino, createTetrominoes } from '../utils/tetrominoes';

import { emitEvent, listenEvent } from '../socket/socketMiddleware';

const TETROMINOES_AMOUNT =
  Number(process.env.REACT_APP_TETROMINOES_AMOUNT) || 20;

let tetrominoes = [];

const buildPlayer = (roomName, previous) => {
  //console.log('hello from buildPlayer')
  //listenEvent('new_tetrominoes', (data) => {
  //  console.log(data.tetrominoes);
  //});
console.log('buildPlayer runs')
  if (previous) {
    tetrominoes = [...previous.tetrominoes];

    if (tetrominoes.length === 3) {
      // If current tetrominoes are exhausted, ask server for new array of tetrominoes
      emitEvent('get_tetrominoes', { roomName });

      // fill let tetrominoes with received from server terominoes symbols:
      const newTetrominoes = Array(TETROMINOES_AMOUNT)
        .fill(0)
        .map((_) => randomTetromino());
      tetrominoes.unshift(...newTetrominoes);

      // Emit event only when new tetrominoes are added
    }
  } else {
    tetrominoes = Array(TETROMINOES_AMOUNT)
      .fill(0)
      .map((_) => randomTetromino());
  }

  const tetromino = tetrominoes.pop(); // Pop a tetromino from the array

  return {
    collided: false,
    isFastDropping: false,
    position: { row: 0, column: 4 },
    tetrominoes,
    tetromino
  };
};

//export const usePlayer = (roomName) => {
//  const [player, setPlayer] = useState(() => buildPlayer(roomName));
//  const [tetr, setTetr] = useState([]);

//  //useEffect(() => {
//  //}, []);
//  console.log('tetr', tetr);
  
//  useEffect(() => {
//    emitEvent('get_tetrominoes', { roomName });
//    console.log('get_tetrominoes')
//    // Listen for "new_tetrominoes" event
//    listenEvent('new_tetrominoes', (data) => {
//      console.log('data.tetrominoes', data);
//      setTetr(tetr.unshift(...createTetrominoes(data)))
//      //let xxx = createTetrominoes(data);
//      //console.log('xxx', xxx);
//      //console.log('tetr', tetr);

//    });
//  }, []);

//  const resetPlayer = useCallback(() => {
//    setPlayer((prev) => buildPlayer(roomName, prev));
//  }, [roomName]);

//  return [player, setPlayer, resetPlayer];
//};

export const usePlayer = (roomName) => {
  const [player, setPlayer] = useState(() => buildPlayer(roomName));

console.log('tetrominoes', tetrominoes)
  useEffect(() => {
    emitEvent('get_tetrominoes', { roomName });

    listenEvent('new_tetrominoes', (data) => {
      const newTetrominoes = createTetrominoes(data);
      tetrominoes.unshift(...newTetrominoes);
      setPlayer((prev) => ({
        ...prev,
        tetrominoes
      }));
    });
  }, [roomName]);

  const resetPlayer = useCallback(() => {
    setPlayer((prev) => buildPlayer(roomName, prev));
  }, [roomName]);

  return [player, setPlayer, resetPlayer];
};
