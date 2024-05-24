import React from 'react';

import '../../styles/tetris-styles/game-stats.css';

const GameStats = ({ gameStats }) => {
  const { level, points, linesCompleted, linesPerLevel } = gameStats;
  const linesToLevel = linesPerLevel - linesCompleted;

  return (
    <ul className="gameStats">
      <li>Level:</li>
      <li data-testid="level-value" className="value">{level}</li>
      <li>Lines to level up:</li>
      <li data-testid="lines-to-level-value" className="value">{linesToLevel}</li>
      <li>Points:</li>
      <li data-testid="points-value" className="value">{points}</li>
    </ul>
  );
};

export default React.memo(GameStats);
