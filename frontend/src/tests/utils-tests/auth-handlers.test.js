import axios from 'axios';
import { errorAlert } from '../../utils/alerts';
import { logout, getUserData, getCookieValue } from '../../utils/auth-handlers';
import '@testing-library/jest-dom';

jest.mock('axios');

jest.mock('../../utils/alerts', () => ({
  errorAlert: jest.fn()
}));

describe('logout function', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it('should call errorAlert with correct message when an error occurs', async () => {
    // Mock axios.get to throw an error
    axios.get.mockRejectedValueOnce(new Error('Test error'));

    try {
      await logout(); // Call the logout function
    } catch (e) {
      // Ignore the error
    }

    // Ensure that errorAlert is called with the correct message
    expect(errorAlert).toHaveBeenCalledWith(
      'Something went wrong while logging out'
    );
  });

  it('should call errorAlert with correct message when an error occurs in getUserData', async () => {
    // Mock axios.get to throw an error
    axios.get.mockRejectedValueOnce({ response: { status: 500 } });

    try {
      await getUserData(); // Call the logout function
    } catch (e) {
      // Ignore the error
    }

    // Ensure that errorAlert is called with the correct message
    expect(errorAlert).toHaveBeenCalledWith(
      'Something went wrong while logging in'
    );
  });

  it('should return the value of the specified cookie', () => {
    const mockDocument = {
      cookie: 'cookie1=value1; cookie2=value2; cookie3=value3'
    };
    const cookieName = 'cookie2';
    const expectedValue = 'value2';

    const result = getCookieValue(cookieName, mockDocument);

    expect(result).toEqual(expectedValue);
  });

  it('should return null if the specified cookie does not exist', () => {
    const mockDocument = {
      cookie: 'cookie1=value1; cookie2=value2; cookie3=value3'
    };
    const cookieName = 'nonExistentCookie';

    const result = getCookieValue(cookieName, mockDocument);

    expect(result).toBeNull();
  });
});
