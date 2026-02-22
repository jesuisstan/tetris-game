import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SignUpModal from './SignUpModal';
import Stack from '@mui/material/Stack';
import FormInput from '../UI/FormInput';
import { errorAlert } from '../../utils/alerts';
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/user-slice';
import TetrisLoader from '../UI/TetrisLoader';
import { useSelector } from 'react-redux';

import * as MUI from '../../styles/MUIstyles';
import styles from '../../styles/login.module.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_BACKEND_PORT}`;

const PleaseLogin = () => {
  const socket = useSelector((state) => state.socket.socket);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingLogin(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/signin`,
        values,
        {
          withCredentials: true
        }
      );
      dispatch(setUser(response.data)); // Dispatch setUser action with the fetched user data
      socket?.emit('user_logged_in', response.data); // todo socket
      navigate('/lobby');
    } catch (error) {
      const statusCode = error.response?.status;
      if (statusCode === 409 || statusCode === 451)
        errorAlert(`${error.response.data.message}`);
      else errorAlert('Something went wrong');

      setLoadingLogin(false);
    }
  };

  const onChange = (event) => {
    const { name, value } = event.target;

    let modifiedValue = value;

    if (name === 'email') {
      modifiedValue = value.toLowerCase();
    }
    modifiedValue = modifiedValue.replace(/\s/g, '');

    setValues({ ...values, [name]: modifiedValue });
  };

  const testLogin = () => {
    setValues({
      email: process.env.REACT_APP_TEST_EMAIL,
      password: process.env.REACT_APP_TEST_PASSWORD
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'left',
        gap: '21px',
        marginTop: '21px'
      }}
    >
      {loading ? (
        <div className={styles.centered}>
          <TetrisLoader />
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '21px'
          }}
        >
          <SignUpModal open={signUpOpen} setOpen={setSignUpOpen} />
          <ErrorOutlineIcon
            fontSize="large"
            sx={{ color: 'var(--TETRIS_PINK)' }}
          />
          <h1>Please login to continue</h1>
          <Stack spacing={2}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '21px',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <form
                onSubmit={handleLogin}
                className={styles.formList}
                data-testid="login-form"
              >
                <FormInput
                  {...{
                    id: 1,
                    name: 'email',
                    type: 'email',
                    placeholder: 'Email',
                    errorMessage: 'Valid email with max length 42',
                    label: 'Email',
                    pattern: '^(?=.{1,42}$)\\S+@\\S+\\.\\S+$',
                    required: true
                  }}
                  value={values.email}
                  onChange={onChange}
                  data-testid="email"
                />
                <FormInput
                  {...{
                    id: 2,
                    name: 'password',
                    type: 'password',
                    placeholder: 'Password',
                    errorMessage:
                      '8-21: 1 ⬆️, 1 ⬇️, 1 digit, 1 of @$!%*?&,.^=_+',
                    label: 'Password',
                    //pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{3,20}$`,
                    pattern:
                      '^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@$!%*?&,.^=_+])[A-Za-z0-9@$!%*?&,.^=_+]{8,21}$',
                    required: true
                  }}
                  value={values.password}
                  onChange={onChange}
                  data-testid="password"
                />
                <LoadingButton
                  type="submit"
                  loading={loadingLogin}
                  variant="contained"
                  color="inherit"
                  sx={MUI.LoadButton}
                >
                  Log In
                </LoadingButton>
                <LoadingButton
                  type="submit"
                  loading={loadingLogin}
                  variant="contained"
                  color="inherit"
                  sx={MUI.LoadButton}
                  onClick={testLogin}
                  startIcon={<ErrorOutlineIcon />}
                >
                  Test
                </LoadingButton>
              </form>
              <LoadingButton
                type="submit"
                variant="contained"
                color="inherit"
                sx={{ ...MUI.LoadButton, width: '87%' }}
                onClick={() => setSignUpOpen(true)}
              >
                Sign Up
              </LoadingButton>
            </div>
          </Stack>
        </div>
      )}
    </div>
  );
};

export default PleaseLogin;
