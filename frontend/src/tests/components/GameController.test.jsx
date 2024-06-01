import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import GameController from '../../components/Game/GameController';
import socketSlice from '../../store/socket-slice';

// Mock dependencies
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn()
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
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

describe('GameController Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('navigates to lobby', async () => {
    const gameStats = { level: 1 }; // Define gameStats object with necessary properties
    const roomData = { name: 'testRoom', admin: { socketId: 'adminId' } }; // Provide necessary roomData
    const board = {}; // Define board object as needed
    const player = { position: { row: 0, col: 0 } }; // Provide a valid player position
    const setPlayer = jest.fn();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <GameController
            roomData={roomData}
            board={board}
            gameStats={gameStats}
            player={player}
            setPlayer={setPlayer}
          />
        </MemoryRouter>
      </Provider>
    );

    // Ensure the input is focused to receive the keydown event
    const inputElement = screen.getByTestId('game-controller');
    inputElement.focus();

    // Simulate key press event with Escape key code
    fireEvent.keyDown(inputElement, { code: 'Escape' });

    // Assertions
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/lobby'));
    expect(mockNavigate).toHaveBeenCalledWith('/lobby');
  });
});
