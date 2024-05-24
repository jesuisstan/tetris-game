import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import Rules from '../../components/Game/Rules';

test('clicking on the toggle button hides or shows the notes section and moves the button', () => {
  render(<Rules />);

  // Initially, the notes section should be visible
  const notesSection = screen.getByText('Notes:');
  expect(notesSection).toBeInTheDocument();
  expect(notesSection).not.toHaveClass('transparent');

  // Click on the toggle button
  fireEvent.click(screen.getByTestId('toggle-button'));

  // Now, the notes section should be hidden
  expect(
    screen.getByTestId('toggle-button').classList.contains('hideButtonMoved')
  ).toBe(true);

  // Click on the toggle button again
  fireEvent.click(screen.getByTestId('toggle-button'));

  // Now, the notes section should be visible again
  expect(notesSection).not.toHaveClass('transparent');
  expect(
    screen.getByTestId('toggle-button').classList.contains('hideButtonMoved')
  ).toBe(false);
});
