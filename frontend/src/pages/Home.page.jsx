import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import * as MUI from '../styles/MUIstyles';
import styles from '../styles/HomePage.module.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.main}>
      <img
        src={require('../assets/logo.png')}
        alt="tetris-logo"
        className={styles.picture}
      />
      <div className={styles.textBlock}>
        <h1>Welcome to Tetris App!</h1>
        .....
        <div>
          <LoadingButton
            endIcon={<ArrowForwardIosIcon />}
            variant="contained"
            color="inherit"
            sx={MUI.LoadButton}
            onClick={() => {
              navigate('/game');
            }}
          >
            Start
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default Home;
