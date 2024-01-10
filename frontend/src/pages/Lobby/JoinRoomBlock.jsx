import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import FormInput from '../../components/UI/FormInput';
import Stack from '@mui/material/Stack';

import * as MUI from '../../styles/MUIstyles';
import styles from '../../styles/lobby-page.module.css';

const JoinRoomBlock = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    nickname: '',
    room: ''
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    let modifiedValue = value.replace(/\s/g, '');
    setValues({ ...values, [name]: modifiedValue });
  };

  const joinRoom = (event) => {
    event.preventDefault();
    setLoading(true);
    const roomUri = `/tetris/${values.room}[${values.nickname}]`;
    navigate(roomUri);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '21px'
      }}
    >
      <h1>Join a room</h1>
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
          <form onSubmit={joinRoom} className={styles.formWrapper}>
            <FormInput
              {...{
                id: 1,
                name: 'inviterNickname',
                type: 'text',
                placeholder: 'nickname',
                errorMessage: 'Max 20 characters. Allowed: a-Z',
                label: 'Nickname of an opponent',
                pattern: '^[A-Za-z0-9]{1,20}$',
                required: true,
                autoComplete: 'off'
              }}
              value={values.nickname}
              onChange={onChange}
            />

            <FormInput
              {...{
                id: 2,
                name: 'room',
                type: 'text',
                placeholder: 'room name',
                errorMessage: 'Max 20 characters. Allowed: a-Z 0-9',
                label: 'Room name',
                pattern: '^[A-Za-z0-9]{1,20}$',
                required: true,
                autoComplete: 'off'
              }}
              value={values.room}
              onChange={onChange}
            />

            <LoadingButton
              type="submit"
              loading={loading}
              variant="contained"
              color="inherit"
              sx={{ ...MUI.LoadButton, width: '100%' }}
            >
              Join
            </LoadingButton>
          </form>
        </div>
      </Stack>
    </div>
  );
};

export default JoinRoomBlock;
