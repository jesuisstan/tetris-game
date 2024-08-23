import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import TetrisConfetti from '../../components/UI/TetrisConfetti';

describe('TetrisConfetti Component', () => {
  test('renders confetti when show prop is true', () => {
    render(<TetrisConfetti show={true} setShow={() => {}} />);

    const confetti = screen.getByTestId('confetti');
    expect(confetti).toBeInTheDocument();
  });

  test('does not render confetti when show prop is false', () => {
    render(<TetrisConfetti show={false} setShow={() => {}} />);

    const confetti = screen.queryByTestId('confetti');
    expect(confetti).not.toBeInTheDocument();
  });

  test('handles window resize correctly', () => {
    const { rerender } = render(<TetrisConfetti show={true} setShow={() => {}} />);

    // Trigger the resize event
    act(() => {
      window.innerWidth = 800;
      window.innerHeight = 600;
      window.dispatchEvent(new Event('resize'));
    });

    // Rerender to update the component with new dimensions
    rerender(<TetrisConfetti show={true} setShow={() => {}} />);

    const confetti = screen.getByTestId('confetti');
    expect(confetti).toHaveAttribute('width', `${window.innerWidth - 10}`);
    expect(confetti).toHaveAttribute('height', `${window.innerWidth < 1040 ? window.innerHeight * 1.9 : window.innerHeight}`);
  });
});
