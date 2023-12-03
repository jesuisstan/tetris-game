import PacmanLoader from 'react-spinners/PacmanLoader';
import * as colors from '../../styles/tetris-colors';

const TetrisLoader = () => {
  return (
    <div
      style={{
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '21px',
        color: colors.TETRIS_WHITE,
        justifyContent: 'center'
      }}
    >
      <p>loading...</p>
      <PacmanLoader
        color={colors.TETRIS_WHITE}
        loading={true}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default TetrisLoader;
