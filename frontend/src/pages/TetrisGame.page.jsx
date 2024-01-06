import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Tetris from '../components/Game/Tetris';
import { useGameOver } from '../hooks/useGameOver';
import LoadingButton from '@mui/lab/LoadingButton';
import FormInput from '../components/UI/FormInput';

import * as MUI from '../styles/MUIstyles';
import styles from '../styles/tetris-styles/tetris.module.css';

const TetrisGame = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [gameOver, setGameOver, resetGameOver] = useGameOver();
  const [values, setValues] = useState({
    nickname: '',
    room: ''
  });

  const start = () => resetGameOver();

  const onChange = (event) => {
    const { name, value } = event.target;
    let modifiedValue = value;

    modifiedValue = modifiedValue.replace(/\s/g, '');
    setValues({ ...values, [name]: modifiedValue });
  };

  const createRoom = () => {
    console.log('cliiiiicked');
    //start();
  };

  console.log(
    'values: ',
    'nickname =',
    values.nickname,
    ', room =',
    values.room
  );

  return (
    <div style={{ marginTop: '21px' }}>
      {gameOver ? (
        <>
          <form onSubmit={createRoom} className={styles.formCreateRoom}>
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
              style={{color: `var(--TETRIS_WHITE)`}}
            />

            <FormInput
              {...{
                id: 1,
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
              sx={MUI.LoadButton}
            >
              Create room
            </LoadingButton>
          </form>
          <LoadingButton
            variant="contained"
            color="inherit"
            sx={MUI.LoadButton}
            onClick={start}
          >
            Play
          </LoadingButton>
        </>
      ) : (
        <Tetris rows={20} columns={10} setGameOver={setGameOver} />
      )}
    </div>
  );
};

export default TetrisGame;
