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

import './styles/index.css';

import io from 'socket.io-client';

const baseUrl = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_FRONTEND_PORT}`;
const socket = io.connect(baseUrl); // todo

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  //fetch user data from database
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user._id) {
        const userData = await utils.getUserData();
        dispatch(setUser(userData));
      }
    };

    fetchUserData();
  }, [dispatch, user._id]);

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
              element={
                user.nickname ? (
                  <Lobby socket={socket} />
                ) : (
                  <PleaseLogin socket={socket} />
                )
              }
            />

            <Route path="/tetris/:room?" element={<GameLayout />} />
          </Route>
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
