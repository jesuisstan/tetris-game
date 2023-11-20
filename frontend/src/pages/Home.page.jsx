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
        src={require('../assets/location.png')}
        alt="InfoMapApp"
        className={styles.picture}
      />
      <div className={styles.textBlock}>
        <h1>Welcome to Info Map App!</h1>
        <ul className={styles.list}>
          <li>
            <h3>See places of interest on World map</h3>
            <br />
          </li>
          <li>
            <h3>Change categories of places</h3>
            <br />
          </li>
          <li>
            <h3>Select the amount of visible places</h3>
            <br />
          </li>
          <li>
            <h3>Move through the whole map</h3>
          </li>
        </ul>
        <div>
          <LoadingButton
            endIcon={<ArrowForwardIosIcon />}
            variant="contained"
            color="inherit"
            sx={MUI.LoadButton}
            onClick={() => {
              navigate('/infomap');
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
