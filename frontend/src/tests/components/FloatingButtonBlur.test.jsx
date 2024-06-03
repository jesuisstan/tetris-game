import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import FloatingButtonBlur from '../../components/UI/FloatingButtonBlur';

describe('FloatingButtonBlur Component', () => {
  test('renders the floating button with correct styling and title', () => {
    render(<FloatingButtonBlur onClick={() => {}} />);

    const floatingButton = screen.getByRole('button', { name: /edit/i });
    expect(floatingButton).toBeInTheDocument();

    expect(floatingButton).toHaveAttribute('title', 'Switch the blur');
  });

  test('calls the onClick function when the button is clicked', async () => {
    // Create a mock function for onClick
    const onClickMock = jest.fn();

    render(<FloatingButtonBlur onClick={onClickMock} />);

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    // Ensure that the onClick function is called
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
