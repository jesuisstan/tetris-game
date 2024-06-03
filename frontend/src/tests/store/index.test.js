import store from '../../store/index';
import { setSocket } from '../../store/socket-slice';
import userReducer from '../../store/user-slice';
import socketReducer from '../../store/socket-slice';

describe('store', () => {
  it('should be created', () => {
    expect(store).toBeDefined();
  });

  it('should have user reducer', () => {
    const state = store.getState();
    expect(state.user).toBeDefined();
    expect(state.user).toEqual(userReducer(undefined, {}));
  });

  it('should have socket reducer', () => {
    const state = store.getState();
    expect(state.socket).toBeDefined();
    expect(state.socket).toEqual(socketReducer(undefined, {}));
  });

  it('should ignore setSocket action for serializable check', () => {
    expect(() => {
      store.dispatch(setSocket({}));
    }).not.toThrow();
  });
});