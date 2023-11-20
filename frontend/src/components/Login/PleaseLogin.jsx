import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import BarLoader from 'react-spinners/BarLoader';
import SignUpModal from './SignUpModal';
import Stack from '@mui/material/Stack';
import FormInput from '../UI/FormInput';
import errorAlert from '../../utils/errorAlert';
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton';
//import { User } from '../../types/User';
import * as colors from '../../styles/mapColors';
import * as MUI from '../../styles/MUIstyles';
import styles from '../../styles/Login.module.css';

const PleaseLogin = ({
  setUser
}) => {
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
      const response = await axios.post(`/api/auth/signin`, values, {
        withCredentials: true
      });
      setUser(response.data);
      navigate('/infomap');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error;
        const statusCode = axiosError.response?.status;
        if (statusCode === 400) errorAlert('Wrong password');
        else if (statusCode === 404)
          errorAlert('User with such an email is not found');
        else errorAlert('Something went wrong');

        setLoadingLogin(false);
      }
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

  return loading ? (
    <div
      style={{
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '21px',
        color: colors.MAP_BLUE,
        justifyContent: 'center'
      }}
    >
      <p>loading...</p>
      <BarLoader
        color={colors.MAP_BLUE}
        loading={loading}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  ) : (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'left',
        gap: '21px'
      }}
    >
      <SignUpModal open={signUpOpen} setOpen={setSignUpOpen} />
      <ErrorOutlineIcon fontSize="large" sx={{ color: colors.MAP_ORANGE }} />
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
          <form onSubmit={handleLogin} className={styles.formList}>
            <FormInput
              {...{
                id: 1,
                name: 'email',
                type: 'email',
                placeholder: 'Email',
                errorMessage: 'Should be a valid email with max length 42',
                label: 'Email',
                pattern: '^(?=.{1,42}$)\\S+@\\S+\\.\\S+$',
                required: true
              }}
              value={values.email}
              onChange={onChange}
            />
            <FormInput
              {...{
                id: 2,
                name: 'password',
                type: 'password',
                placeholder: 'Password',
                errorMessage:
                  '3-20 chars, 1 letter, 1 number, 1 special symbol',
                label: 'Password',
                pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{3,20}$`,
                required: true
              }}
              value={values.password}
              onChange={onChange}
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
  );
};

export default PleaseLogin;