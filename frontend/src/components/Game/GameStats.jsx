import React from 'react';

import '../../styles/tetris-styles/game-stats.css';

const GameStats = ({ gameStats }) => {
  const { level, points, linesCompleted, linesPerLevel } = gameStats;
  const linesToLevel = linesPerLevel - linesCompleted;

  return (
    <ul className="gameStats">
      <li>Level:</li>
      <li className="value">{level}</li>
      <li>Lines to level up:</li>
      <li className="value">{linesToLevel}</li>
      <li>Points:</li>
      <li className="value">{points}</li>
    </ul>
  );
};

export default React.memo(GameStats);
