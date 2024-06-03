import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import MagicButton from '../../components/UI/MagicButton';

describe('MagicButton Component', () => {
  test('renders the button with provided text', () => {
    const buttonText = 'Click me!';
    render(<MagicButton text={buttonText} />);
    const button = screen.getByText(buttonText);
    expect(button).toBeInTheDocument();
  });

  test('invokes the provided action function when clicked', () => {
    const mockAction = jest.fn();
    render(<MagicButton text="Click me!" action={mockAction} />);
    const button = screen.getByText('Click me!');
    fireEvent.click(button);
    expect(mockAction).toHaveBeenCalled();
  });
});
