import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import * as MUI from '../styles/MUIstyles';
import * as colors from '../styles/tetris-colors';

const NotFound = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '21px'
      }}
    >
      <ErrorOutlineIcon fontSize="large" sx={{ color: colors.TETRIS_PINK }} />
      <h1>Not Found</h1>
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
