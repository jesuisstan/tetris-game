import { TETROMINOES_AMMOUNT } from '../index.js';

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

  // method to get an array of <TETROMINOES_AMMOUNT> random tetrominoes:
  getTetrominoes() {
    let tetrominoes = [];

    for (let i = 0; i < TETROMINOES_AMMOUNT; i++) {
      tetrominoes.push(this.createRandomTetromino());
    }

    return tetrominoes;
  }
}

export default Tetromino;
