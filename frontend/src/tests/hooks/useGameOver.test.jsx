import { act, renderHook } from '@testing-library/react';
import { useGameOver } from '../../hooks/useGameOver';

describe('useGameOver hook', () => {

  test('should initialize gameOver to true', () => {
    const { result } = renderHook(() => useGameOver());
    expect(result.current[0]).toBe(true);
  });

  test('should reset gameOver to false', () => {
    const { result } = renderHook(() => useGameOver());
    act(() => {
      result.current[2](); // resetGameOver
    });
    expect(result.current[0]).toBe(false);
  });

  test('should update gameOver state', () => {
    const { result } = renderHook(() => useGameOver());
    act(() => {
      result.current[1](false); // setGameOver to false
    });
    expect(result.current[0]).toBe(false);
  });
});