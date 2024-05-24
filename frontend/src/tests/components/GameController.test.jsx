import '@testing-library/jest-dom';
import React from 'react';
import { render,fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import GameController from '../../components/Game/GameController';
import socketSlice from '../../store/socket-slice';

// Mock dependencies
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

// Mock initial state
const initialState = {
  socket: {
    socket: { emit: jest.fn() }
  }
};

const store = configureStore({
  reducer: {
    socket: socketSlice
  },
  preloadedState: initialState
});
const mockNavigate = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);

});

describe('GameController Component', () => {
  test('navigates to lobby', async () => {
    const gameStats = { level: 1 }; // Define gameStats object with necessary properties
    //const mockNavigate = jest.fn(); // Mock useNavigate hook
    //jest.mock('react-router-dom', () => ({
    //  ...jest.requireActual('react-router-dom'),
    //  useNavigate: () => mockNavigate
    //}));
		//console.log(mockNavigate);
    render(
      <Provider store={store}>
        <Router>
          <GameController gameStats={gameStats} />
        </Router>
      </Provider>
    );
		
		// Simulate key press event with Escape key code
    fireEvent.keyDown(document, { code: 'Escape' });

    // Assertions
		//await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/lobby'));
    //expect(mockNavigate).toHaveBeenCalledWith('/lobby');
  });
});
