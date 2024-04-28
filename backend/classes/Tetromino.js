import { TETROMINOES_AMOUNT } from '../index.js';

class Tetromino {
  constructor() {}

  // method to generate a random tetromino:
  createRandomTetromino() {
    let randomTetromino = Math.floor(Math.random() * 7);

    switch (randomTetromino) {
      case 0:
        return 'I';
      case 1:
        return 'J';
      case 2:
        return 'L';
      case 3:
        return 'O';
      case 4:
        return 'S';
      case 5:
        return 'T';
      case 6:
        return 'Z';
    }
  }

  // method to get an array of <TETROMINOES_AMOUNT> random tetrominoes:
  getTetrominoes = async () =>  {
    let tetrominoes = [];

    for (let i = 0; i < TETROMINOES_AMOUNT; i++) {
      tetrominoes.push(this.createRandomTetromino());
    }

    return tetrominoes;
  }
}

export default Tetromino;
