import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import FloatingButtonLeave from '../../components/UI/FloatingButtonLeave';

describe('FloatingButtonLeave Component', () => {
  test('renders the floating button with correct styling and title', () => {
    render(<FloatingButtonLeave onClick={() => {}} />);

    const floatingButton = screen.getByRole('button', { name: /edit/i });
    expect(floatingButton).toBeInTheDocument();

    expect(floatingButton).toHaveAttribute('title', 'Leave the room');
  });

  test('calls the onClick function when the button is clicked', async () => {
    // Create a mock function for onClick
    const onClickMock = jest.fn();

    render(<FloatingButtonLeave onClick={onClickMock} />);

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    // Ensure that the onClick function is called
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
