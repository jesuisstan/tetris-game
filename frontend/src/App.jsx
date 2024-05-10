import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home.page';
import NotFound from './components/NotFound.page';
import Lobby from './components/Lobby/Lobby.page';
import MainLayout from './components/UI/MainLayout';
import PleaseLogin from './components/Login/PleaseLogin';
import GameLayout from './components/Game/GameLayout';
import * as utils from './utils/auth-handlers';

import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './store/user-slice';

//import io from 'socket.io-client';

import {
  initializeSocket,
  closeSocket,
  emitEvent,
  listenEvent
} from './socket/socket-middleware';
import { setSocket } from './store/socket-slice';
import { getSocket } from './socket/socket-middleware';

import './styles/index.css';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    initializeSocket(dispatch);
    return () => {
      closeSocket();
    };
  }, [dispatch]);

  //fetch user data from database
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user._id) {
        const userData = await utils.getUserData();
        dispatch(setUser(userData));
      } else {
        emitEvent('player_arrived', user?.nickname);
      }
    };

    fetchUserData();
  }, [dispatch, user._id]);

  useEffect(() => {
    listenEvent('welcome', ({ message }) => {
      console.log('message from server:', message);
    });
  }, []);

  return (
    <HashRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index={true} element={<Home />} />

            <Route path="login" element={<PleaseLogin />} />

            <Route path="*" element={<NotFound />} />

            <Route
              path="lobby"
              element={user.nickname ? <Lobby /> : <PleaseLogin />}
            />

            <Route path="/tetris/:room?" element={<GameLayout />} />
          </Route>
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
