import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormInput from '../UI/FormInput';
import axios from 'axios';
import errorAlert from '../../utils/error-alert';
import saveAlert from '../../utils/save-alert';
import * as MUI from '../../styles/MUIstyles';
import * as colors from '../../styles/tetris-colors';
import styles from '../../styles/Login.module.css';

const baseUrl = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_FRONTEND_PORT}`;

const SignUpModal = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);

  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    email: '',
    password: ''
  });

  const handleSignUp = async (e) => {
    e.preventDefault();

    setLoad(true);
    try {
      await axios.post(`${baseUrl}/api/auth/signup`, values, {
        withCredentials: true
      });
      setOpen(false);
      setLoad(false);
      saveAlert();
      navigate('/login');
    } catch (error) {
      setLoad(false);
      setOpen(false);
      errorAlert('Error while creating new account');
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

  return (
    <Modal
      sx={{ color: colors.TETRIS_BLACK }}
      open={open}
      onClose={(event, reason) => {
        if (event && reason === 'closeClick') {
          setLoad(false);
          setOpen(false);
        }
      }}
    >
      <ModalDialog
        aria-labelledby="basic-modal-dialog-title"
        sx={MUI.modalDialog}
      >
        <ModalClose sx={MUI.modalClose} />
        <Typography sx={MUI.modalHeader}>Create new account</Typography>
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
            <form onSubmit={handleSignUp} className={styles.formList}>
              <FormInput
                {...{
                  id: 1,
                  name: 'firstName',
                  type: 'text',
                  placeholder: 'First name',
                  errorMessage: 'Max 20 characters. Allowed: A-Z a-z',
                  label: 'First name',
                  pattern: '^[A-Za-z]{1,20}$',
                  required: true
                }}
                value={values.firstName}
                onChange={onChange}
              />
              <FormInput
                {...{
                  id: 2,
                  name: 'lastName',
                  type: 'text',
                  placeholder: 'Last name',
                  errorMessage: 'Max 20 characters. Allowed: A-Z a-z',
                  label: 'Last name',
                  pattern: '^[A-Za-z]{1,20}$',
                  required: true
                }}
                value={values.lastName}
                onChange={onChange}
              />
              <FormInput
                {...{
                  id: 3,
                  name: 'nickname',
                  type: 'text',
                  placeholder: 'Nickname',
                  errorMessage: 'Max 20 characters. Allowed: A-Z a-z 0-9',
                  label: 'Nickname',
                  pattern: '^[A-Za-z0-9]{1,20}$',
                  required: true
                }}
                value={values.nickname}
                onChange={onChange}
              />
              <FormInput
                {...{
                  id: 4,
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
                  id: 5,
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
                loading={load}
                variant="contained"
                color="inherit"
                sx={MUI.LoadButton}
              >
                Sign Up
              </LoadingButton>
            </form>
          </div>
        </Stack>
      </ModalDialog>
    </Modal>
  );
};

export default SignUpModal;
