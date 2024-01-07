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

  const [values, setValues] = useState({
    nickname: '',
    room: ''
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    let modifiedValue = value;

    modifiedValue = modifiedValue.replace(/\s/g, '');
    setValues({ ...values, [name]: modifiedValue });
  };

  const createRoom = (event) => {
    event.preventDefault();
    const roomUri = `/tetris/${values.room}[${user.nickname}]`;
    navigate(roomUri);
  };

  console.log(
    'values: ',
    'nickname =',
    values.nickname,
    ', room =',
    values.room
  );

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
                errorMessage: 'Max 20 characters. Allowed: A-Z a-z',
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
                errorMessage: 'Max 20 characters. Allowed: A-Z a-z',
                label: 'Room name',
                pattern: '^[A-Za-z]{1,20}$',
                required: true
              }}
              value={values.room}
              onChange={onChange}
            />

            <LoadingButton
              type="submit"
              //loading={loadingLogin}
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
