import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Previews from '../../components/Game/Previews';

describe('Previews Component', () => {
  test('renders previews when tetrominoes are provided', () => {
    const tetrominoes = [
      {
        shape: [
          [1, 1],
          [1, 1]
        ],
        className: 'I'
      },
      {
        shape: [
          [1, 1, 1],
          [0, 1, 0]
        ],
        className: 'T'
      },
      {
        shape: [
          [1, 1, 1],
          [1, 0, 0]
        ],
        className: 'L'
      }
    ];

    render(<Previews tetrominoes={tetrominoes} />);

    const previews = screen.getAllByTestId('preview');
    expect(previews).toHaveLength(1);
  });

  test('renders loader on first render', () => {
    render(<Previews tetrominoes={[]} />);

    const loader = screen.getByText(/Make your 1st drop/i);
    expect(loader).toBeInTheDocument();
  });

  test('renders previews correctly after first render', () => {
    const tetrominoes = [
      {
        shape: [
          [1, 1],
          [1, 1]
        ],
        className: 'I'
      },
      {
        shape: [
          [1, 1, 1],
          [0, 1, 0]
        ],
        className: 'T'
      },
      {
        shape: [
          [1, 1, 1],
          [1, 0, 0]
        ],
        className: 'L'
      }
    ];

    const { rerender } = render(<Previews tetrominoes={[]} />);

    rerender(<Previews tetrominoes={tetrominoes} />);

    const previews = screen.getAllByTestId('preview');
    expect(previews).toHaveLength(1);
  });
});
