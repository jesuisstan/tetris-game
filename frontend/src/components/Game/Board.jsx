import BoardCell from './BoardCell';

import '../../styles/tetris-styles/board.css';

const Board = ({ board }) => {
  if (!board || !board.rows) return null;

  const boardStyles = {
    gridTemplateRows: `repeat(${board?.size?.rows}, 1fr)`,
    gridTemplateColumns: `repeat(${board?.size?.columns}, 1fr)`
  };

  return (
    <div className="board" style={boardStyles}>
      {board?.rows?.map((row, y) =>
        row.map((cell, x) => (
          <BoardCell key={x * board?.size?.columns + x} cell={cell} />
        ))
      )}
    </div>
  );
};

export default Board;
