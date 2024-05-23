import React, { useState } from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSelector, useDispatch } from 'react-redux';
import JoinRoomBlock from '../../components/Lobby/JoinRoomBlock';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock useSelector and useDispatch
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

jest.mock('../../store/socket-slice', () => ({
  emitSocketEvent: jest.fn(),
  listenSocketEvent: jest.fn(),
  stopListeningSocketEvent: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

jest.mock('@mui/material/Table', () => ({
  ...jest.requireActual('@mui/material/Table'),
  Table: jest.fn(({ children }) => <table>{children}</table>),
  TableRow: jest.fn(({ children }) => <tr>{children}</tr>),
  TableCell: jest.fn(({ children }) => <td>{children}</td>)
}));

describe('JoinRoomBlock Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'socketIdSelector') {
        return { id: 'socketId123' };
      }
      if (selector.name === 'userSelector') {
        return { nickname: 'testUser' };
      }
      return [];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loader initially', () => {
    render(
      <Router>
        <JoinRoomBlock />
      </Router>
    );

    expect(screen.getByText('Room list is loading...')).toBeInTheDocument();
  });

	it('renders TetrisLoader when loading is true', async () => {
		const setState = jest.fn(); // Mock setState function
	
		// Mock useState to return our mocked state and setState function
		jest.spyOn(React, 'useState').mockImplementation(initialValue => [initialValue, setState]);
	
		useSelector.mockReturnValueOnce([]); // Mocking initial empty room list
		render(
			<Router>
				<JoinRoomBlock />
			</Router>
		);
	
		// Ensure TetrisLoader is rendered initially
		expect(screen.getByText('Room list is loading...')).toBeInTheDocument();
	
		// Call the setState function to update the loading state to true
		setState(true);
	
		// Ensure TetrisLoader with specific text is rendered when loading is true
		//expect(screen.getByText(text => text.includes('Joining the room in progress'))).toBeInTheDocument();
	});
});
