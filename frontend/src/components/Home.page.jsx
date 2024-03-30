import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Preview from './Game/Preview';
import { TETROMINOES } from '../utils/tetrominoes';

import * as MUI from '../styles/MUIstyles';
import styles from '../styles/home-page.module.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.main}>
      <h1>Welcome to Tetris Game!</h1>

      <div className={styles.previewBlock}>
        <div className={styles.trio}>
          <div className={styles.glitch}>
            <Preview tetromino={TETROMINOES.J} index={1} key={1} />
          </div>
          <div className={styles.glitch}>
            <Preview tetromino={TETROMINOES.O} index={3} key={3} />
          </div>
          <div className={styles.glitch}>
            <Preview tetromino={TETROMINOES.S} index={5} key={5} />
          </div>
        </div>

        <div className={styles.glitch}>
          <Preview tetromino={TETROMINOES.I} index={4} key={4} />
        </div>

        <div className={styles.trio}>
          <div className={styles.glitch}>
            <Preview tetromino={TETROMINOES.Z} index={7} key={7} />
          </div>
          <div className={styles.glitch}>
            <Preview tetromino={TETROMINOES.T} index={6} key={6} />
          </div>
          <div className={styles.glitch}>
            <Preview tetromino={TETROMINOES.L} index={2} key={2} />
          </div>
        </div>
      </div>

      <div className={styles.optionsBlock}>
        <p style={{ color: 'var(--TETRIS_WHITE)' }}>
          Play "solo" <br />
          to practice a little
        </p>
        <p style={{ color: 'var(--TETRIS_GREEN)' }}>--- OR ---</p>
        <p style={{ color: 'var(--TETRIS_WHITE)' }}>
          Play "competition"
          <br />
          to prove skills online
        </p>
      </div>

      <div>
        <LoadingButton
          //endIcon={<ArrowForwardIosIcon />}
          variant="contained"
          color="inherit"
          sx={MUI.LoadButton}
          onClick={() => {
            navigate('/lobby');
          }}
        >
          C'est parti!
        </LoadingButton>
      </div>
    </div>
  );
};

export default Home;
