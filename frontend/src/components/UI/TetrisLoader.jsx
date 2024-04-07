import PacmanLoader from 'react-spinners/PacmanLoader';

const TetrisLoader = ({ text }) => {
  return (
    <div
      style={{
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: '21px',
        color: 'var(--TETRIS_WHITE)',
        justifyContent: 'center'
      }}
    >
      <p
        style={{
          animation: 'pulse 1.5s infinite'
        }}
      >
        {text ? text : 'Loading...'}
      </p>
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
