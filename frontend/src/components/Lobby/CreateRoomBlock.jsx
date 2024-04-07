import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingButton from '@mui/lab/LoadingButton';
import FormInput from '../../components/UI/FormInput';
import Stack from '@mui/material/Stack';
import RadioButtonsGroup from '../UI/RadioButtonsGroup';
import errorAlert from '../../utils/error-alert';

import { initializeSocket, closeSocket, emitEvent, listenEvent } from '../../socket/socketMiddleware';

import * as MUI from '../../styles/MUIstyles';
import styles from '../../styles/lobby.module.css';

const CreateRoomBlock = () => {
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

  //const createRoom = (event) => {
  //  event.preventDefault();
  //  setLoading(true);
  //  const roomUri = `/tetris/${room}[${user.nickname}]`;

  //  //socket.emit('create_user_room', { ...user, room: room }); // todo

  //  socket.emit('create_room', { room, gameMode }); // todo
  //  setLoading(false);
  //  //navigate(roomUri);
  //};

  //// listen to mesages from server:
  //useEffect(() => {
  //  //socket.on('update_rooms', (data) => {
  //  //  const updatedRoomsList = data.roomsList;
  //  //  console.log('updated RoomsList', updatedRoomsList);
  //  //});

  //  socket.on('room_already_exists', () => {
  //    errorAlert('Room with such a name already exists');
  //  });
  //}, []);


  const createRoom = (event) => {
    event.preventDefault();
    setLoading(true);
    const roomUri = `/tetris/${room}[${user.nickname}]`;

    emitEvent('create_room', { room, gameMode }); // Emitting create_room event

    setLoading(false);
    navigate(roomUri);
  };

  useEffect(() => {
    listenEvent('room_already_exists', () => {
      errorAlert('Room with such a name already exists');
    });
  }, []);

  return (
    <div
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
                errorMessage: 'Max 10 characters. Allowed: a-Z 0-9',
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
