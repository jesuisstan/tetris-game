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
    <div className="previewMain">
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
          <Preview tetromino={tetromino} index={index} key={index} />
        ))
      )}
    </div>
  );
};

export default React.memo(Previews);
