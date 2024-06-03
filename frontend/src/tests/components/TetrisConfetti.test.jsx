import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
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
});
