import React from 'react';

import Preview from './Preview';

import '../../styles/tetris-styles/preview.css';

const Previews = ({ tetrominoes }) => {
  // Preview 3 next tetrominoes
  const previewTetrominoes = tetrominoes
    .slice(tetrominoes.length - 3)
    .reverse();

  return (
    <div className="previewMain">
      <p>Next tetromino:</p>
      {previewTetrominoes.map((tetromino, index) => (
        <Preview tetromino={tetromino} index={index} key={index} />
      ))}
    </div>
  );
};

export default React.memo(Previews);
