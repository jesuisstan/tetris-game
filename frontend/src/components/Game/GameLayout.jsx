import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import Tetris from './Tetris';
import { useGameOver } from '../../hooks/useGameOver';
import LoadingButton from '@mui/lab/LoadingButton';

import * as MUI from '../../styles/MUIstyles';

const baseUrl = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_FRONTEND_PORT}`;
const socket = io.connect(baseUrl);
console.log('socket', socket);

const GameLayout = () => {
  const user = useSelector((state) => state.user);
 
  let roomPlusNickname = window.location.href.split('/')[5]; // Assuming window.location.href.split('/')[5] is 'zzz[TestUser]'
  const regex = /\[(.*?)\]/; // Regular expression to extract text within square brackets
  const matches = roomPlusNickname.match(regex); // Match the regex against the string
  let room, inviterNickname;
  if (matches && matches.length > 1) {
    room = roomPlusNickname.split('[')[0]; // Extract characters before '[' as room
    inviterNickname = matches[1]; // Extract characters within square brackets as nickname
  } else {
    room = '';
    inviterNickname = '';
  }
  
  console.log('Room:', room);
  console.log('inviterNickname:', inviterNickname);

  const [gameOver, setGameOver, resetGameOver] = useGameOver();
  const start = () => resetGameOver();

  useEffect(() => {
    socket.emit('join', { inviterNickname: inviterNickname, room: room });
  }, []);

  useEffect(() => {
    socket.on('message', ({ data }) => {
      console.log('data from server:', data);
    });
  }, []);

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
        <Tetris rows={20} columns={10} setGameOver={setGameOver} />
      )}
    </div>
  );
};

export default GameLayout;
