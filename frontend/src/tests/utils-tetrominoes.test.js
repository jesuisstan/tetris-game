import {
  TETROMINOES,
  randomTetromino,
  createTetrominoes,
  rotate,
  transferToBoard
} from '../utils/tetrominoes';

describe('Tetromino tests', () => {
  test('randomTetromino returns a valid tetromino', () => {
    const tetromino = randomTetromino();
    expect(tetromino).toBeDefined();
    expect(Object.keys(TETROMINOES)).toContain(
      Object.keys(TETROMINOES).find((key) => TETROMINOES[key] === tetromino)
    );
  });

  test('createTetrominoes returns correct tetrominoes', () => {
    const symbols = ['I', 'J', 'L', 'O', 'S', 'T', 'Z', 'PENALTY'];
    const tetrominoes = createTetrominoes(symbols);
    expect(tetrominoes).toHaveLength(symbols.length);
    symbols.forEach((symbol, index) => {
      expect(tetrominoes[index]).toEqual(TETROMINOES[symbol]);
    });
  });

  test('rotate rotates tetromino correctly', () => {
    const piece = TETROMINOES.I.shape;
    const direction = 1;
    const rotatedPiece = rotate({ piece, direction });
    expect(rotatedPiece).toEqual([
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
  });

  test('transferToBoard transfers tetromino to board correctly', () => {
    const className = 'test';
    const isOccupied = true;
    const position = { row: 0, column: 0 };
    const rows = [
      [{ occupied: false }, { occupied: false }],
      [{ occupied: false }, { occupied: false }]
    ];
    const shape = [
      [1, 0],
      [0, 1]
    ];
    const updatedRows = transferToBoard({
      className,
      isOccupied,
      position,
      rows,
      shape
    });
    expect(updatedRows).toEqual([
      [
        { occupied: true, className: 'test' },
        { occupied: false, className: undefined }
      ],
      [
        { occupied: false, className: undefined },
        { occupied: true, className: 'test' }
      ]
    ]);
  });
});
