import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import FormInput from '../../components/UI/FormInput';

describe('FormInput Component', () => {
  const defaultProps = {
    id: 'test-input',
    label: 'Test Label',
    onChange: jest.fn(),
    value: '',
    type: 'text',
    errorMessage: ''
  };

  test('renders the input component without crashing', () => {
    render(<FormInput {...defaultProps} />);
    const inputElement = screen.getByLabelText('Test Label:');
    expect(inputElement).toBeInTheDocument();
  });

  test('displays the correct label', () => {
    render(<FormInput {...defaultProps} />);
    const labelElement = screen.getByText('Test Label:');
    expect(labelElement).toBeInTheDocument();
  });

  test('correctly handles focus state', () => {
    render(<FormInput {...defaultProps} />);
    const inputElement = screen.getByLabelText('Test Label:');
    fireEvent.focus(inputElement);
    expect(inputElement).toHaveAttribute('focused', 'true');
    fireEvent.blur(inputElement);
    expect(inputElement).toHaveAttribute('focused', 'false');
  });

  test('displays error message when provided', () => {
    render(<FormInput {...defaultProps} errorMessage="Test Error" />);
    const errorMessageElement = screen.getByText('Test Error');
    expect(errorMessageElement).toBeInTheDocument();
  });

  test('triggers onChange callback when input value changes', () => {
    render(<FormInput {...defaultProps} />);
    const inputElement = screen.getByLabelText('Test Label:');
    fireEvent.change(inputElement, { target: { value: 'test value' } });
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  test('displays the input value correctly', () => {
    render(<FormInput {...defaultProps} value="test value" />);
    const inputElement = screen.getByLabelText('Test Label:');
    expect(inputElement).toHaveValue('test value');
  });

  test('toggles password visibility when button is clicked', () => {
    render(<FormInput {...defaultProps} type="password" />);
    const inputElement = screen.getByLabelText('Test Label:');
    const toggleButton = screen.getByRole('button');
    expect(inputElement).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(inputElement).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(inputElement).toHaveAttribute('type', 'password');
  });

  test('password visibility button is not rendered for non-password inputs', () => {
    render(<FormInput {...defaultProps} />);
    const toggleButton = screen.queryByRole('button');
    expect(toggleButton).not.toBeInTheDocument();
  });

  test('focused state is correctly set on focus', () => {
    render(<FormInput {...defaultProps} />);
    const inputElement = screen.getByLabelText('Test Label:');

    fireEvent.focus(inputElement);
    expect(inputElement).toHaveAttribute('focused', 'true');
  });
});
