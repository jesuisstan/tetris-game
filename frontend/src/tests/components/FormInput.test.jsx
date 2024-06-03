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
    fireEvent.blur(inputElement);
    expect(inputElement).not.toHaveFocus();
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
});
