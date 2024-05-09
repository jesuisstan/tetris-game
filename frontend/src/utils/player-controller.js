import { hasCollision, isWithinBoard } from './board';
import { rotate } from './tetrominoes';
import { Action } from './input';

const attemptRotation = ({ board, player, setPlayer }) => {
  const currentShape = player.tetromino.shape;
  const currentPosition = player.position;

  // Attempt rotation without moving horizontally
  let rotatedShape = rotate({ piece: currentShape, direction: 1 });
  let isValidRotation =
    isWithinBoard({ board, position: currentPosition, shape: rotatedShape }) &&
    !hasCollision({ board, position: currentPosition, shape: rotatedShape });

  // If rotation failed, try moving horizontally and then rotating
  if (!isValidRotation) {
    const possiblePositions = [
      { row: currentPosition.row, column: currentPosition.column - 1 }, // Try moving left
      { row: currentPosition.row, column: currentPosition.column + 1 } // Try moving right
    ];

    for (const newPosition of possiblePositions) {
      isValidRotation =
        isWithinBoard({ board, position: newPosition, shape: rotatedShape }) &&
        !hasCollision({ board, position: newPosition, shape: rotatedShape });

      if (isValidRotation) {
        setPlayer({
          ...player,
          tetromino: { ...player.tetromino, shape: rotatedShape },
          position: newPosition
        });
        return; // Rotation successful after horizontal movement
      }
    }
  }

  // If rotation is still not possible, return false
  if (!isValidRotation) {
    return false;
  }

  // Rotation is successful without horizontal movement
  setPlayer({
    ...player,
    tetromino: { ...player.tetromino, shape: rotatedShape }
  });
};

export const movePlayer = ({ delta, position, shape, board }) => {
  const desiredNextPosition = {
    row: position.row + delta.row,
    column: position.column + delta.column
  };

  const collided = hasCollision({
    board,
    position: desiredNextPosition,
    shape
  });

  const isOnBoard = isWithinBoard({
    board,
    position: desiredNextPosition,
    shape
  });

  const preventMove = !isOnBoard || (isOnBoard && collided);
  const nextPosition = preventMove ? position : desiredNextPosition;

  const isMovingDown = delta.row > 0;
  const isHit = isMovingDown && (collided || !isOnBoard);

  return { collided: isHit, nextPosition };
};

const attemptMovement = ({ board, action, player, setPlayer, setGameOver }) => {
  const delta = { row: 0, column: 0 };
  let isFastDropping = false;

  if (action === Action.FastDrop) {
    isFastDropping = true;
  } else if (action === Action.SlowDrop) {
    delta.row += 1;
  } else if (action === Action.Left) {
    delta.column -= 1;
  } else if (action === Action.Right) {
    delta.column += 1;
  }

  const { collided, nextPosition } = movePlayer({
    delta,
    position: player?.position,
    shape: player?.tetromino?.shape,
    board
  });

  // Did we collide immediately? If so, game over, man!
  const isGameOver = collided && player.position.row === 0;
  if (isGameOver) {
    setGameOver(isGameOver);
  }

  setPlayer({
    ...player,
    collided,
    isFastDropping,
    position: nextPosition
  });
};

export const playerController = ({
  action,
  board,
  player,
  setPlayer,
  setGameOver
}) => {
  if (!action) return;

  if (action === Action.Rotate) {
    attemptRotation({ board, player, setPlayer });
  } else {
    attemptMovement({ board, player, setPlayer, action, setGameOver });
  }
};
