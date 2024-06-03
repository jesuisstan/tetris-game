import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import GameStats from '../../components/Game/GameStats';

test('renders game stats with correct valuess', () => {
  const gameStats = {
    level: 5,
    points: 1000,
    linesCompleted: 2,
    linesPerLevel: 10
  };
  render(<GameStats gameStats={gameStats} />);

  // Find the elements using data-testid
  const levelValue = screen.getByTestId('level-value');
  const linesToLevelValue = screen.getByTestId('lines-to-level-value');
  const pointsValue = screen.getByTestId('points-value');

  // Assert that the elements have the expected text content
  expect(levelValue).toHaveTextContent('5');
  expect(linesToLevelValue).toHaveTextContent('8');
  expect(pointsValue).toHaveTextContent('1000');
});
