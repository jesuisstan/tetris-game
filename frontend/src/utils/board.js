import { movePlayer } from './player-controller';
import { transferToBoard, TETROMINOES } from './tetrominoes';

export const defaultCell = {
  occupied: false,
  className: ''
};

export const buildBoard = ({ rows, columns }) => {
  const builtRows = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => ({ ...defaultCell }))
  );

  return {
    rows: builtRows,
    size: { rows, columns }
  };
};

const findDropPosition = ({ board, position, shape }) => {
  if (!board || !position || !shape) return;

  let max = board.size.rows - position.row + 1;
  let row = 0;

  for (let i = 0; i < max; i++) {
    const delta = { row: i, column: 0 };
    const result = movePlayer({ delta, position, shape, board });
    const { collided } = result;

    if (collided) {
      break;
    }

    row = position.row + i;
  }

  return { ...position, row };
};

const canSpawnTetromino = ({ board, position, shape }) => {
  if (!board || !position || !shape) return false;

  // Simulate the initial position of the tetromino on the board
  for (let y = 0; y < shape.length; y++) {
    const row = y + position.row;

    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const column = x + position.column;

        // Check if the simulated cell overlaps with existing occupied cells
        if (board.rows?.[row] && board.rows?.[row][column]?.occupied) {
          return false; // Collision detected, cannot spawn tetromino
        }
      }
    }
  }

  return true; // No collision detected, tetromino can be spawned
};

export const nextBoard = ({
  board,
  player,
  resetPlayer,
  addLinesCleared,
  penaltyRows
}) => {
  if (!board || !player || !resetPlayer || !addLinesCleared) return;
  const { tetromino, position } = player;

  // Check if the next tetromino can spawn without colliding with existing cells
  if (!canSpawnTetromino({ board, position, shape: tetromino?.shape })) {
    return board; // Return the current board without making any changes
  }

  // Copy and clear spaces used by pieces that hadn't collided and occupied spaces permanently
  let rows = board?.rows?.map((row) =>
    row.map((cell) => (cell.occupied ? cell : { ...defaultCell }))
  );

  // Drop position
  const dropPosition = findDropPosition({
    board,
    position,
    shape: tetromino?.shape
  });

  // Place ghost
  const className = `${tetromino?.className} ${
    player.isFastDropping ? '' : 'ghost'
  }`;
  rows = transferToBoard({
    className,
    isOccupied: player.isFastDropping,
    position: dropPosition,
    rows,
    shape: tetromino?.shape
  });

  // Place the piece. If it collided, mark the board cells as collided
  if (!player.isFastDropping) {
    rows = transferToBoard({
      className: tetromino?.className,
      isOccupied: player.collided,
      position,
      rows,
      shape: tetromino?.shape
    });
  }

  const blankRow = rows?.[0]?.map((_) => ({ ...defaultCell }));
  let linesCleared = 0;
  rows = rows?.reduce((acc, row) => {
    if (
      row.every(
        (column) => column.occupied && !column.className.includes('penalty')
      )
    ) {
      linesCleared++;
      acc.unshift([...blankRow]);
    } else {
      acc.push(row);
    }

    return acc;
  }, []);

  if (linesCleared > 0) {
    addLinesCleared(linesCleared);
  }

  if (player.collided || player.isFastDropping) {
    resetPlayer();
  }

  // Add penalty rows
  if (penaltyRows >= 1) {
    const penaltyTetromino = TETROMINOES.PENALTY;

    for (let i = 0; i < penaltyRows; i++) {
      const position = { row: i + board.size.rows - penaltyRows, column: 0 };
      rows = transferToBoard({
        className: penaltyTetromino.className,
        isOccupied: true,
        position,
        rows,
        shape: penaltyTetromino.shape
      });
    }
  }

  // Return the next board
  return {
    rows,
    size: { ...board.size }
  };
};

export const hasCollision = ({ board, position, shape }) => {
  if (!board || !position || !shape) return;

  for (let y = 0; y < shape.length; y++) {
    const row = y + position.row;

    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const column = x + position.column;

        if (
          board.rows?.[row] &&
          board.rows?.[row][column] &&
          board.rows?.[row][column].occupied
        ) {
          return true;
        }
      }
    }
  }

  return false;
};

export const isWithinBoard = ({ board, position, shape }) => {
  if (!board || !position || !shape) return;

  for (let y = 0; y < shape.length; y++) {
    const row = y + position.row;

    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const column = x + position.column;
        const isValidPosition = board.rows?.[row] && board.rows?.[row][column];

        if (!isValidPosition) return false;
      }
    }
  }

  return true;
};
