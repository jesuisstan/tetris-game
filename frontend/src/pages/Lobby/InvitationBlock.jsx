import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingButton from '@mui/lab/LoadingButton';
import FormInput from '../../components/UI/FormInput';
import Stack from '@mui/material/Stack';

import * as MUI from '../../styles/MUIstyles';
import styles from '../../styles/lobby-page.module.css';

const InvitationBlock = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState('');

  const onChange = (event) => {
    const { value } = event.target;
    let modifiedValue = value;

    modifiedValue = modifiedValue.replace(/\s/g, '');
    setRoom(modifiedValue);
  };

  const createRoom = (event) => {
    event.preventDefault();
    setLoading(true)
    const roomUri = `/tetris/${room}[${user.nickname}]`;
    navigate(roomUri);
  };

  console.log('values: ', 'room =', room);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '21px'
      }}
    >
      <h1>Create a room</h1>
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
          <form onSubmit={createRoom} className={styles.formWrapper}>
            <FormInput
              {...{
                id: 1,
                name: 'nickname',
                type: 'text',
                placeholder: 'nickname',
                errorMessage: 'Max 20 characters. Allowed: a-Z',
                label: 'Nickname',
                pattern: '^[A-Za-z]{1,20}$',
                required: true
              }}
              value={user.nickname}
              onChange={onChange}
              disabled
              style={{ color: `var(--TETRIS_WHITE)` }}
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
              value={room}
              onChange={onChange}
            />

            <LoadingButton
              type="submit"
              loading={loading}
              variant="contained"
              color="inherit"
              sx={{ ...MUI.LoadButton, width: '100%' }}
            >
              Create
            </LoadingButton>
          </form>
        </div>
      </Stack>
    </div>
  );
};

export default InvitationBlock;
