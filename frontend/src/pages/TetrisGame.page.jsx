import { useNavigate } from 'react-router-dom';
import Tetris from '../components/Game/Tetris';

const TetrisGame = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Game!</h1>
      <Tetris />
    </div>
  );
};

export default TetrisGame;
