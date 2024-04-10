import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import Preview from './Game/Preview';
import { TETROMINOES } from '../utils/tetrominoes';
import DeviderTetris from './UI/DeviderTetris';

import * as MUI from '../styles/MUIstyles';
import styles from '../styles/home-page.module.css';
import magicStyles from '../styles/magic-btn.module.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.main}>
      <h1>Welcome to Tetris Game!</h1>

      <div className={styles.previewBlock}>
        <div className={styles.trio}>
          <div className={styles.spinToRight}>
            <Preview tetromino={TETROMINOES.J} index={1} key={1} />
          </div>
          <div className={styles.spinToRight}>
            <Preview tetromino={TETROMINOES.O} index={3} key={3} />
          </div>
          <div className={styles.spinToRight}>
            <Preview tetromino={TETROMINOES.S} index={5} key={5} />
          </div>
        </div>

        <div className={`glitch ${styles.centerItem}`}>
          <Preview tetromino={TETROMINOES.I} index={4} key={4} />
        </div>

        <div className={styles.trio}>
          <div className={styles.spinToLeft}>
            <Preview tetromino={TETROMINOES.Z} index={7} key={7} />
          </div>
          <div className={styles.spinToLeft}>
            <Preview tetromino={TETROMINOES.T} index={6} key={6} />
          </div>
          <div className={styles.spinToLeft}>
            <Preview tetromino={TETROMINOES.L} index={2} key={2} />
          </div>
        </div>
      </div>

      <div className={styles.optionsBlock}>
        <div>
          <div className={styles.left}>
            <p style={{ color: 'var(--TETRIS_WHITE)' }}>
              Play "solo" <br />
              to practice a little
            </p>
          </div>
        </div>

        <div className={styles.deviderTetris}>
          <DeviderTetris />
        </div>
        <div className={styles.deviderTetrisVertical}>---OR---</div>

        <div>
          <div className={styles.right}>
            <p style={{ color: 'var(--TETRIS_WHITE)' }}>
              Play "competition"
              <br />
              to prove skills online
            </p>
          </div>
        </div>
      </div>
      <div
        className={magicStyles.magic}
        onClick={() => {
          navigate('/lobby');
        }}
      >
        C'est parti!
      </div>
    </div>
  );
};

export default Home;
