import PacmanLoader from 'react-spinners/PacmanLoader';

const TetrisLoader = () => {
  return (
    <div
      style={{
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '21px',
        color: 'var(--TETRIS_WHITE)',
        justifyContent: 'center'
      }}
    >
      <p>loading...</p>
      <PacmanLoader
        color={`var(--TETRIS_WHITE)`}
        loading={true}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default TetrisLoader;
