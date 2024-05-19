import { Action, Key, actionIsDrop, actionForKey } from '../../utils/input';

describe('Action tests', () => {
  test('Action constants are defined correctly', () => {
    expect(Action.Left).toBe('Left');
    expect(Action.FastDrop).toBe('FastDrop');
    expect(Action.Exit).toBe('Exit');
    expect(Action.Quit).toBe('Quit');
    expect(Action.Right).toBe('Right');
    expect(Action.Rotate).toBe('Rotate');
    expect(Action.SlowDrop).toBe('SlowDrop');
  });

  test('Key mappings are defined correctly', () => {
    expect(Key.ArrowUp).toBe(Action.Rotate);
    expect(Key.ArrowDown).toBe(Action.SlowDrop);
    expect(Key.ArrowLeft).toBe(Action.Left);
    expect(Key.ArrowRight).toBe(Action.Right);
    expect(Key.KeyQ).toBe(Action.Quit);
    expect(Key.Escape).toBe(Action.Exit);
    expect(Key.Space).toBe(Action.FastDrop);
  });

  test('actionIsDrop correctly identifies drop actions', () => {
    expect(actionIsDrop(Action.SlowDrop)).toBe(true);
    expect(actionIsDrop(Action.FastDrop)).toBe(true);
    expect(actionIsDrop(Action.Left)).toBe(false);
    expect(actionIsDrop(Action.Right)).toBe(false);
    expect(actionIsDrop(Action.Rotate)).toBe(false);
    expect(actionIsDrop(Action.Exit)).toBe(false);
    expect(actionIsDrop(Action.Quit)).toBe(false);
  });

  test('actionForKey returns correct action for a given keyCode', () => {
    expect(actionForKey('ArrowUp')).toBe(Action.Rotate);
    expect(actionForKey('ArrowDown')).toBe(Action.SlowDrop);
    expect(actionForKey('ArrowLeft')).toBe(Action.Left);
    expect(actionForKey('ArrowRight')).toBe(Action.Right);
    expect(actionForKey('KeyQ')).toBe(Action.Quit);
    expect(actionForKey('Escape')).toBe(Action.Exit);
    expect(actionForKey('Space')).toBe(Action.FastDrop);
    // Test for undefined key
    expect(actionForKey('KeyZ')).toBeUndefined();
  });
});
