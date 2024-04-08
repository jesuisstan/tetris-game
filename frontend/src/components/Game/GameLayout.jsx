import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
//import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import Tetris from './Tetris';
import { useGameOver } from '../../hooks/useGameOver';
import LoadingButton from '@mui/lab/LoadingButton';
import errorAlert from '../../utils/error-alert';

import * as MUI from '../../styles/MUIstyles';

//const baseUrl = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_FRONTEND_PORT}`;
//const socket = io.connect(baseUrl);

const GameLayout = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  let roomPlusNickname = window.location.href.split('/')[5]; // Assuming window.location.href.split('/')[5] is 'zzz[TestUser]'
  const regex = /\[(.*?)\]/; // Regular expression to extract text within square brackets
  const matches = roomPlusNickname.match(regex); // Match the regex against the string
  let roomName= ''
  if (matches && matches.length > 1) {
    roomName = roomPlusNickname.split('[')[0]; // Extract characters before '[' as room

  }

  //useEffect(() => {
  //  if (player.nickname && player.room) {
  //    socket.emit('join_room', { player });
  //  } else {
  //    navigate('/not-found');
  //  }
  //}, []);

  //useEffect(() => {
  //  socket.on('message', ({ data }) => {
  //    console.log('data from server:', data);
  //  });

  //  socket.on('roomFull', ({ message }) => {
  //    errorAlert(message);
  //    navigate('/lobby');
  //  });
  //}, []);

  const [gameOver, setGameOver, resetGameOver] = useGameOver();
  const start = () => resetGameOver();

  return (
    <div style={{ marginTop: '21px' }}>
      {gameOver ? (
        <LoadingButton
          variant="contained"
          color="inherit"
          sx={MUI.LoadButton}
          onClick={start}
        >
          Play
        </LoadingButton>
      ) : (
        <Tetris room={roomName} rows={20} columns={10} setGameOver={setGameOver} />
      )}
    </div>
  );
};

export default GameLayout;
