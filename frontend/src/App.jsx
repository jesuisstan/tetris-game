import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './store/user-slice';
import {
  initializeSocket,
  emitSocketEvent,
  closeSocket
} from './store/socket-slice';

import Home from './components/Home.page';
import NotFound from './components/NotFound.page';
import Lobby from './components/Lobby/Lobby.page';
import MainLayout from './components/Layout/MainLayout';
import PleaseLogin from './components/Login/PleaseLogin';
import GameLayout from './components/Game/GameLayout';
import * as authUtils from './utils/auth-handlers';

import './styles/index.css';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(initializeSocket());
    return () => {
      dispatch(closeSocket());
    };
  }, [dispatch]);

  // fetch user data from database:
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user._id) {
        const userData = await authUtils.getUserData();
        dispatch(setUser(userData));
      } else {
        dispatch(
          emitSocketEvent({
            eventName: 'player_arrived',
            data: {
              nickname: user?.nickname
            }
          })
        );
      }
    };

    fetchUserData();
  }, [dispatch, user._id]);

  return (
    <BrowserRouter>
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

            <Route path=":room/:player_name" element={<GameLayout />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
