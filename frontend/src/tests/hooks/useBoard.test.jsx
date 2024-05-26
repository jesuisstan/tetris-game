import { act, renderHook } from '@testing-library/react';
import { useBoard } from '../../hooks/useBoard';

jest.useFakeTimers();

describe('useBoard hook', () => {
  test('should initialize board state correctly', async () => {
    const rows = 20;
    const columns = 10;
    const player = {}; // Mock player object
    const resetPlayer = jest.fn(); // Mock resetPlayer function
    const addLinesCleared = jest.fn(); // Mock addLinesCleared function
    const penaltyRows = 0;

    const { result } = renderHook(() =>
      useBoard({
        rows,
        columns,
        player,
        resetPlayer,
        addLinesCleared,
        penaltyRows
      })
    );

    // Fast forward the timer to ensure loading state is false
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const [board] = result.current;

    // Ensure the board is initialized with the correct dimensions
    expect(board.rows.length).toBe(rows);
    expect(board.rows.every((row) => row.length === columns)).toBe(true);
  });
});
