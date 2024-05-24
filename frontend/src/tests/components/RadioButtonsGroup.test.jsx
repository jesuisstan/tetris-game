import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import RadioButtonsGroup from '../../components/UI/RadioButtonsGroup';

describe('RadioButtonsGroup Component', () => {
  test('handles change in selected value', () => {
    const setValueMock = jest.fn();

    render(<RadioButtonsGroup value="solo" setValue={setValueMock} />);

    const competitionRadio = screen.getByLabelText('Competition');
    fireEvent.click(competitionRadio);

    expect(setValueMock).toHaveBeenCalledWith('competition');
  });
});
