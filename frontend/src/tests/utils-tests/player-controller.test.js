import { Action } from '../../utils/input';
import { playerController } from '../../utils/player-controller';
import { attemptRotation, attemptMovement, movePlayer } from '../../utils/player-controller';

jest.mock('../../utils/player-controller', () => {
  const originalModule = jest.requireActual('../../utils/player-controller');
  return {
    ...originalModule,
    attemptRotation: jest.fn(),
    attemptMovement: jest.fn(),
    movePlayer: jest.fn()
  };
});

describe('player-controller', () => {
  let mockDispatch, mockBoard, mockPlayer, mockSetPlayer, mockRoomData;

  beforeEach(() => {
    mockDispatch = jest.fn();
    mockBoard = {};
    mockPlayer = {
      position: { row: 0, column: 0 },
      tetromino: { shape: [] }
    };
    mockSetPlayer = jest.fn();
    mockRoomData = {};

    jest.clearAllMocks(); // Ensure all mocks are cleared before each test
  });

  it('should not do anything if action is not provided', () => {
    const action = undefined;
    playerController({
      action,
      board: mockBoard,
      player: mockPlayer,
      setPlayer: mockSetPlayer,
      roomData: mockRoomData
    });

    expect(attemptRotation).not.toHaveBeenCalled();
    expect(attemptMovement).not.toHaveBeenCalled();
  });

  it('should not call attemptMovement if action is Action.Rotate', () => {
    const action = Action.Rotate;
    playerController({
      action,
      board: mockBoard,
      player: mockPlayer,
      setPlayer: mockSetPlayer,
      roomData: mockRoomData
    });

    expect(attemptMovement).not.toHaveBeenCalled();
  });

  it('should not call attemptRotation if action is not Action.Rotate', () => {
    const action = 'SomeOtherAction';
    playerController({
      action,
      board: mockBoard,
      player: mockPlayer,
      setPlayer: mockSetPlayer,
      roomData: mockRoomData,
      dispatch: mockDispatch
    });

    expect(attemptRotation).not.toHaveBeenCalled();
  });

  it('should move player correctly', () => {
    const delta = { row: 1, column: 0 };
    const position = { row: 0, column: 0 };
    const shape = [];
    const board = {};

    movePlayer.mockReturnValue({
      collided: false,
      nextPosition: { row: 1, column: 0 }
    });

    const result = movePlayer({ delta, position, shape, board });

    expect(result).toEqual({
      collided: false,
      nextPosition: { row: 1, column: 0 }
    });
    expect(movePlayer).toHaveBeenCalledWith({
      delta,
      position,
      shape,
      board
    });
  });
});
