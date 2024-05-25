import React from 'react';
import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import Board from '../../components/Game/Board';

describe('Board Component', () => {
  test('renders board correctly with provided board data', () => {
    const board = {
      rows: [
        [
          { type: 'empty', className: 'empty' },
          { type: 'filled', className: 'filled' }
        ],
        [
          { type: 'filled', className: 'filled' },
          { type: 'empty', className: 'empty' }
        ]
      ],
      size: { rows: 2, columns: 2 }
    };
    render(<Board board={board} />);

    // Ensure cells are rendered correctly
    const boardCells = screen.getAllByTestId('board-cell');
    expect(boardCells.length).toBe(4); // Check if all cells are rendered
  });

  test('renders game over overlay when gameover is true', () => {
    const board = {
      rows: [
        [
          { type: 'empty', className: 'empty' },
          { type: 'empty', className: 'empty' }
        ],
        [
          { type: 'empty', className: 'empty' },
          { type: 'empty', className: 'empty' }
        ]
      ],
      size: { rows: 2, columns: 2 }
    };
    render(<Board board={board} gameover />);

    expect(screen.getByText('Game over')).toBeInTheDocument(); // Game over overlay should be present
  });

  test('renders nothing when board data is not provided', () => {
    render(<Board />);

    expect(screen.queryByTestId('board')).toBeNull(); // Board should not render anything without board data
  });
});
