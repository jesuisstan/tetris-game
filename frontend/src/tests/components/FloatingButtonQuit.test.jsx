import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import FloatingButtonQuit from '../../components/UI/FloatingButtonQuit';

describe('FloatingButtonQuit Component', () => {
  test('renders the floating button with correct styling and title', () => {
    render(<FloatingButtonQuit onClick={() => {}} />);

    const floatingButton = screen.getByRole('button', { name: /edit/i });
    expect(floatingButton).toBeInTheDocument();

    expect(floatingButton).toHaveAttribute('title', 'Quit the game round');
  });

  test('calls the onClick function when the button is clicked', async () => {
    // Create a mock function for onClick
    const onClickMock = jest.fn();

    render(<FloatingButtonQuit onClick={onClickMock} />);

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    // Ensure that the onClick function is called
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
