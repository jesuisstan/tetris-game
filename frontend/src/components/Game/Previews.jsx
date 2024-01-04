import React from 'react';

import Preview from './Preview';

const Previews = ({ tetrominoes }) => {
  // Preview 2 next tetrominoes
  const previewTetrominoes = tetrominoes
    .slice(2 - tetrominoes.length)
    .reverse();

  return (
    <>
      {previewTetrominoes.map((tetromino, index) => (
        <Preview tetromino={tetromino} index={index} key={index} />
      ))}
    </>
  );
};

export default React.memo(Previews);
