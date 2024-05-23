import { movePlayer } from '../../utils/player-controller';
import {
  buildBoard,
  defaultCell,
  nextBoard,
  hasCollision,
  isWithinBoard
} from '../../utils/board';
import { transferToBoard } from '../../utils/tetrominoes';

jest.mock('../../utils/player-controller', () => ({
  movePlayer: jest.fn()
}));

jest.mock('../../utils/tetrominoes', () => ({
  transferToBoard: jest.fn(),
  TETROMINOES: {
    PENALTY: {
      shape: [[1, 1, 1, 1]],
      className: 'penalty'
    }
  }
}));

describe('board utilities', () => {
  let mockBoard,
    mockPlayer,
    mockSetPlayer,
    mockRoomData,
    mockResetPlayer,
    mockAddLinesCleared;

  beforeEach(() => {
    mockBoard = buildBoard({ rows: 20, columns: 10 });
    mockPlayer = {
      position: { row: 0, column: 0 },
      tetromino: {
        shape: [
          [1, 1],
          [1, 1]
        ],
        className: 'tetromino'
      },
      isFastDropping: false,
      collided: false
    };
    mockSetPlayer = jest.fn();
    mockRoomData = {};
    mockResetPlayer = jest.fn();
    mockAddLinesCleared = jest.fn();
  });

  it('should build an empty board', () => {
    const { rows, size } = buildBoard({ rows: 20, columns: 10 });
    expect(rows).toHaveLength(20);
    expect(rows[0]).toHaveLength(10);
    expect(size).toEqual({ rows: 20, columns: 10 });
    expect(rows[0][0]).toEqual(defaultCell);
  });

  it('should detect a collision', () => {
    mockBoard.rows[0][0] = { occupied: true };
    const result = hasCollision({
      board: mockBoard,
      position: { row: 0, column: 0 },
      shape: [[1]]
    });
    expect(result).toBe(true);
  });

  it('should not detect a collision', () => {
    const result = hasCollision({
      board: mockBoard,
      position: { row: 0, column: 0 },
      shape: [[1]]
    });
    expect(result).toBe(false);
  });

  it('should be within the board', () => {
    const result = isWithinBoard({
      board: mockBoard,
      position: { row: 0, column: 0 },
      shape: [[1]]
    });
    expect(result).toBe(true);
  });

  it('should not be within the board', () => {
    const result = isWithinBoard({
      board: mockBoard,
      position: { row: 19, column: 0 },
      shape: [[1], [1]]
    });
    expect(result).toBe(false);
  });

  it('should update the board with the next tetromino', () => {
    movePlayer.mockReturnValue({
      collided: false,
      nextPosition: { row: 0, column: 0 }
    });
    transferToBoard.mockReturnValue(mockBoard.rows);

    const result = nextBoard({
      board: mockBoard,
      player: mockPlayer,
      resetPlayer: mockResetPlayer,
      addLinesCleared: mockAddLinesCleared,
      penaltyRows: 0
    });

    expect(result.rows).toHaveLength(20);
    expect(result.rows[0]).toHaveLength(10);
    //expect(mockResetPlayer).toHaveBeenCalled();
  });

  it('should not update the board if spawning collides', () => {
    mockBoard.rows[0][0] = { occupied: true };

    const result = nextBoard({
      board: mockBoard,
      player: mockPlayer,
      resetPlayer: mockResetPlayer,
      addLinesCleared: mockAddLinesCleared,
      penaltyRows: 0
    });

    expect(result).toEqual(mockBoard);
    expect(mockResetPlayer).not.toHaveBeenCalled();
  });
});
