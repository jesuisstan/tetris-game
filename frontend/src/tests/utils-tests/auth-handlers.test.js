import axios from 'axios';
import { errorAlert } from '../../utils/alerts';
import { initialUserState } from '../../store/user-slice';
import { getCookieValue, getUserData, logout } from '../../utils/auth-handlers';
import '@testing-library/jest-dom';

jest.mock('axios');
jest.mock('../../utils/alerts', () => ({
  errorAlert: jest.fn()
}));

describe('Utils functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCookieValue', () => {
    it('should return the value of the specified cookie', () => {
      document.cookie = 'testCookie=testValue';
      const value = getCookieValue('testCookie');
      expect(value).toBe('testValue');
    });

    it('should return null if the cookie is not found', () => {
      document.cookie = 'testCookie=testValue';
      const value = getCookieValue('nonExistingCookie');
      expect(value).toBe(null);
    });
  });

  describe('getUserData', () => {
    it('should return user data on successful request', async () => {
      const mockData = { name: 'John Doe' };
      axios.get.mockResolvedValue({ data: mockData });

      const data = await getUserData();

      expect(data).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith(
        `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_BACKEND_PORT}/api/users/getuser`,
        { withCredentials: true }
      );
    });

    it('should call errorAlert on request failure (status not 401)', async () => {
      axios.get.mockRejectedValue({
        response: { status: 500 }
      });

      await getUserData();

      expect(errorAlert).toHaveBeenCalledWith(
        'Something went wrong while logging in'
      );
    });

    it('should not call errorAlert on request failure with status 401', async () => {
      axios.get.mockRejectedValue({
        response: { status: 401 }
      });

      await getUserData();

      expect(errorAlert).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should return initialUserState on successful request', async () => {
      axios.get.mockResolvedValue({});

      const result = await logout();

      expect(result).toEqual(initialUserState);
      expect(axios.get).toHaveBeenCalledWith(
        `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_BACKEND_PORT}/api/auth/logout`,
        { withCredentials: true }
      );
    });

    it('should call errorAlert on request failure', async () => {
      axios.get.mockRejectedValue(new Error('Logout failed'));

      await logout();

      expect(errorAlert).toHaveBeenCalledWith(
        'Something went wrong while logging out'
      );
    });
  });
});
