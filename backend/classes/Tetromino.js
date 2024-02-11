class Tetromino {
  constructor() {}

  // method to generate a random tetromino:
  createRandomTetromino() {
    let randomTetrimino = Math.floor(Math.random() * 7);
    switch (randomTetrimino) {
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

  // method to get an array of 20 random tetrominoes:
  getTetrominoes() {
    let tetrominoes = [];
    for (let i = 0; i < 20; i++) {
      tetrominoes.push(this.createRandomTetromino());
    }
    return tetrominoes;
  }
}

//module.exports = Tetromino; //todo
export default Tetromino;
