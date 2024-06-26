import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import {
  emitSocketEvent,
  listenSocketEvent,
  stopListeningSocketEvent
} from '../../store/socket-slice';

import LoadingButton from '@mui/lab/LoadingButton';
import FormInput from '../../components/UI/FormInput';
import Stack from '@mui/material/Stack';
import RadioButtonsGroup from '../UI/RadioButtonsGroup';
import { errorAlert } from '../../utils/alerts';

import * as MUI from '../../styles/MUIstyles';
import styles from '../../styles/lobby.module.css';

const CreateRoomBlock = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState('');
  const [gameMode, setGameMode] = useState('solo');

  const onChange = (event) => {
    const { value } = event.target;
    let modifiedValue = value.replace(/\s/g, '');
    setRoom(modifiedValue);
  };

  const createRoom = (event) => {
    event.preventDefault();
    setLoading(true);
    const roomUri = `/${room}/${user.nickname}`;

    dispatch(
      emitSocketEvent({
        eventName: 'create_room',
        data: { room, gameMode, nickname: user.nickname }
      })
    );

    setLoading(false);
    navigate(roomUri);
  };

  useEffect(() => {
    dispatch(
      listenSocketEvent({
        eventName: 'room_already_exists',
        callback: () => {
          errorAlert('Room with such a name already exists');
          navigate('/lobby');
        }
      })
    );

    return () => {
      dispatch(
        stopListeningSocketEvent({
          eventName: 'room_already_exists',
          callback: null
        })
      );
    };
  }, []);

  return (
    <div
      data-testid="create-room-block"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '21px'
      }}
    >
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
                id: 2,
                name: 'room',
                type: 'text',
                //placeholder: 'room name',
                errorMessage: 'Max 10 characters: a-Z 0-9',
                label: 'Room name',
                pattern: '^[A-Za-z0-9]{1,10}$',
                required: true,
                autoComplete: 'off'
              }}
              value={room}
              onChange={onChange}
            />

            <RadioButtonsGroup value={gameMode} setValue={setGameMode} />

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

export default CreateRoomBlock;
