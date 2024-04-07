import { useState, useCallback } from "react";

import { randomTetromino } from "../utils/tetrominoes";

const TETROMINOES_AMMOUNT = Number(process.env.REACT_APP_TETROMINOES_AMMOUNT) || 20

const buildPlayer = (previous) => {
  let tetrominoes;

  if (previous) {
    tetrominoes = [...previous.tetrominoes];
    tetrominoes.unshift(randomTetromino());
    console.log('1111111111')
    console.log('previous', previous)

  } else {
    console.log('2222')

    tetrominoes = Array(TETROMINOES_AMMOUNT)
      .fill(0)
      .map((_) => randomTetromino());
  }
//console.log('TETR', tetrominoes[1])
  return {
    collided: false,
    isFastDropping: false,
    position: { row: 0, column: 4 },
    tetrominoes,
    tetromino: tetrominoes.pop()
  };
};

export const usePlayer = () => {
  const [player, setPlayer] = useState(buildPlayer());

  const resetPlayer = useCallback(() => {
    setPlayer((prev) => buildPlayer(prev));
  }, []);

  return [player, setPlayer, resetPlayer];
};
