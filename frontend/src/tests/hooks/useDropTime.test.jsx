import { act, renderHook } from '@testing-library/react';
import { useDropTime } from '../../hooks/useDropTime';

describe('useDropTime hook', () => {
  test('should initialize dropTime', () => {
    const { result } = renderHook(() =>
      useDropTime({ gameStats: { level: 1 } })
    );
    expect(result.current[0]).toBeDefined();
  });

  test('should resume dropTime', () => {
    const { result } = renderHook(() =>
      useDropTime({ gameStats: { level: 1 } })
    );
    act(() => {
      result.current[1](); // pauseDropTime
      result.current[2](); // resumeDropTime
    });
    expect(result.current[0]).toBeDefined();
  });
});
