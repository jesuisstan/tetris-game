import React, { useEffect, useRef } from 'react';
import Preview from './Preview';
import TetrisLoader from '../UI/TetrisLoader';

import '../../styles/tetris-styles/preview.css';

const Previews = ({ tetrominoes }) => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, []);

  const previewTetrominoes = tetrominoes.slice(-4, -1).reverse();

  return (
    <div
      data-testid="preview"
      className={`previewMain ${!isFirstRender.current ? 'overflow' : ''}`}
    >
      <p>Next tetromino:</p>
      {isFirstRender.current ? (
        <div>
          <TetrisLoader>
            <span style={{ fontSize: 'x-small' }}>
              Make your 1st drop
              <br /> and see the light...
            </span>
          </TetrisLoader>
        </div>
      ) : (
        previewTetrominoes.map((tetromino, index) => (
          <div className="previewAnimated" key={index}>
            <Preview
              data-testid="preview-single"
              tetromino={tetromino}
              index={index}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default React.memo(Previews);
