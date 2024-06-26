import '../../styles/tetris-styles/board.css';

const BoardCell = ({ cell }) => (
  <div data-testid="board-cell" className={`BoardCell ${cell.className}`}>
    <div className="Sparkle"></div>
  </div>
);

export default BoardCell;