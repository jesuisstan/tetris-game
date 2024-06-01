import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import GameController from '../../components/Game/GameController';
import socketSlice, { emitSocketEvent } from '../../store/socket-slice';
import { Action } from '../../utils/input';

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

  test('dispatches game_over event on Quit action', async () => {
    const gameStats = { level: 1 }; // Define gameStats object with necessary properties
    const roomData = { name: 'testRoom', admin: { socketId: 'adminId' } }; // Provide necessary roomData
    const board = {}; // Define board object as needed
    const player = { position: { row: 0, col: 0 } }; // Provide a valid player position
    const setPlayer = jest.fn();

    const { getByTestId } = render(
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
    const inputElement = getByTestId('game-controller');
    inputElement.focus();

    // Simulate key press event with Q key code
    fireEvent.keyDown(inputElement, { code: 'KeyQ' });

    // Assertions
    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith(
        emitSocketEvent({
          eventName: 'game_over',
          data: {
            roomName: roomData.name,
            roomAdmin: roomData.admin.socketId,
          },
        })
      )
    );
  });

  test('handles general key actions', async () => {
    const gameStats = { level: 1 }; // Define gameStats object with necessary properties
    const roomData = { name: 'testRoom', admin: { socketId: 'adminId' } }; // Provide necessary roomData
    const board = {}; // Define board object as needed
    const player = { position: { row: 0, col: 0 } }; // Provide a valid player position
    const setPlayer = jest.fn();
    const dropTime = 1000; // Ensure dropTime is set

    const { getByTestId } = render(
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
    const inputElement = getByTestId('game-controller');
    inputElement.focus();

    // Simulate key press event with a key code that corresponds to a general action
    fireEvent.keyDown(inputElement, { code: 'ArrowDown' }); // Replace 'ArrowDown' with the appropriate key code for your action

    // Assertions
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      // Add additional assertions as needed to verify handleInput behavior
    });
  });
});
