import userReducer, { setUser } from '../../store/user-slice';

describe('user reducer', () => {
  it('should handle setUser', () => {
    const previousState = { lastName: '' };
    expect(userReducer(previousState, setUser({ lastName: 'Doe' }))).toEqual({
      lastName: 'Doe'
    });
  });
});
