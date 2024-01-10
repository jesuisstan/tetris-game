import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import * as MUI from '../styles/MUIstyles';
import styles from '../styles/not-found.module.css';

const NotFound = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.basic}>
      <div className={styles.glitch}>
        <h1>404</h1>
        <h1>Not Found</h1>
      </div>
      <LoadingButton
        loading={loading}
        startIcon={<ArrowBackIosIcon />}
        variant="contained"
        color="inherit"
        sx={MUI.LoadButton}
        onClick={() => {
          setLoading(true);
          setTimeout(() => navigate(-1), 500);
        }}
      >
        Back
      </LoadingButton>
    </div>
  );
};

export default NotFound;
