import { act, renderHook } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { emitSocketEvent } from '../../store/socket-slice';
import { usePlayer } from '../../hooks/usePlayer'; // Adjust the import path as necessary

// Mock the useDispatch and emitSocketEvent
jest.mock('react-redux', () => ({
  useDispatch: jest.fn()
}));
jest.mock('../../store/socket-slice', () => ({
  emitSocketEvent: jest.fn()
}));

describe('usePlayer hook', () => {
  let dispatch;
  const roomName = 'test-room';
  const mockTetromino = 'I';
  const popTetromino = jest.fn(() => mockTetromino);

  beforeEach(() => {
    dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches emitSocketEvent when initialTetrominoes length is 4', () => {
    const initialTetrominoes = ['I', 'J', 'L', 'O'];

    // Render the hook
    const { result } = renderHook(() =>
      usePlayer(roomName, initialTetrominoes, popTetromino)
    );

    // Verify the dispatch was called with emitSocketEvent
    expect(dispatch).toHaveBeenCalledWith(
      emitSocketEvent({
        eventName: 'get_tetrominoes',
        data: { roomName: roomName }
      })
    );

    // Verify the player state
    const [player] = result.current;
    expect(player.tetrominoes).toEqual(initialTetrominoes);
    expect(player.tetromino).toBe(mockTetromino);
  });

  it('resets player state when resetPlayer is called', () => {
    const initialTetrominoes = ['I', 'J', 'L', 'O'];

    // Render the hook
    const { result } = renderHook(() =>
      usePlayer(roomName, initialTetrominoes, popTetromino)
    );

    // Call resetPlayer
    act(() => {
      const [, , resetPlayer] = result.current;
      resetPlayer();
    });

    // Verify the player state was reset
    const [player] = result.current;
    expect(player.tetrominoes).toEqual(initialTetrominoes);
    expect(player.tetromino).toBe(mockTetromino);

    // Verify the dispatch was called with emitSocketEvent again
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(
      emitSocketEvent({
        eventName: 'get_tetrominoes',
        data: { roomName: roomName }
      })
    );
  });
});
