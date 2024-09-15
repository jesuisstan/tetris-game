import { useNavigate } from 'react-router-dom';
import Preview from '../Game/Preview';
import { TETROMINOES } from '../../utils/tetrominoes';
import DeviderTetris from '../UI/DeviderTetris';
import MagicButton from '../UI/MagicButton';

import styles from '../../styles/home-page.module.css';
import logoCSS from '../../assets/powered-by/logo-css.png';
import logoHTML from '../../assets/powered-by/logo-html.png';
import logoJS from '../../assets/powered-by/logo-js.png';
import logoMaterialUI from '../../assets/powered-by/logo-material-ui.png';
import logoMongoDB from '../../assets/powered-by/logo-mongodb.png';
import logoNode from '../../assets/powered-by/logo-node.png';
import logoReact from '../../assets/powered-by/logo-react.png';
import logoRedux from '../../assets/powered-by/logo-redux.png';
import logoJWT from '../../assets/powered-by/logo-jwt.png';
import logoSocketIO from '../../assets/powered-by/logo-socket-io.png';
import logoSweetalert2 from '../../assets/powered-by/logo-sweetalert2.png';
import logoJest from '../../assets/powered-by/logo-jest.png';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.main}>
      <h1>Welcome to Red Tetris Game!</h1>

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
              to practice your skills offline
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
              to prove your skills online
            </p>
          </div>
        </div>
      </div>
      <MagicButton
        text="C'est parti!"
        action={() => {
          navigate('/lobby');
        }}
      />

      {/* POWERED BY */}
      <div className={styles.poweredByBlock}>
        <h3>Powered by:</h3>
        <div className={styles.logoContainer}>
          <div className={styles.logoItem}>
            <img
              src={logoCSS}
              alt="CSS Logo"
              className={styles.poweredByLogo}
            />
            <p>CSS</p>
          </div>
          <div className={styles.logoItem}>
            <img
              src={logoHTML}
              alt="HTML Logo"
              className={styles.poweredByLogo}
            />
            <p>HTML</p>
          </div>
          <div className={styles.logoItem}>
            <img
              src={logoJS}
              alt="JavaScript Logo"
              className={styles.poweredByLogo}
            />
            <p>JavaScript</p>
          </div>
          <div className={styles.logoItem}>
            <img
              src={logoMongoDB}
              alt="MongoDB Logo"
              className={styles.poweredByLogo}
            />
            <p>MongoDB</p>
          </div>
          <div className={styles.logoItem}>
            <img
              src={logoNode}
              alt="Node.js Logo"
              className={styles.poweredByLogo}
            />
            <p>Node.js</p>
          </div>
          <div className={styles.logoItem}>
            <img
              src={logoReact}
              alt="React Logo"
              className={styles.poweredByLogo}
            />
            <p>React</p>
          </div>
          <div className={styles.logoItem}>
            <img
              src={logoRedux}
              alt="Redux Logo"
              className={styles.poweredByLogo}
            />
            <p>Redux</p>
          </div>
          <div className={styles.logoItem}>
            <img
              src={logoJWT}
              alt="JWT Logo"
              className={styles.poweredByLogo}
            />
            <p>JWT</p>
          </div>
          <div className={styles.logoItem}>
            <img
              src={logoSocketIO}
              alt="Socket.io Logo"
              className={styles.poweredByLogo}
            />
            <p>Socket.io</p>
          </div>
          <div className={styles.logoItem}>
            <img
              src={logoMaterialUI}
              alt="Material UI Logo"
              className={styles.poweredByLogo}
            />
            <p>Material UI</p>
          </div>
          <div className={styles.logoItem}>
            <img
              src={logoSweetalert2}
              alt="Sweetalert2 Logo"
              className={styles.poweredByLogo}
            />
            <p>Sweetalert2</p>
          </div>
          <div className={styles.logoItem}>
            <img
              src={logoJest}
              alt="Jest Logo"
              className={styles.poweredByLogo}
            />
            <p>Jest</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
