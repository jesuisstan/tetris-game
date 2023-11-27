import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.page';
import NotFound from './pages/NotFound.page';
import MainLayout from './components/UI/MainLayout';
import PleaseLogin from './components/Login/PleaseLogin';
import * as utils from './utils/auth-handlers';
import './styles/index.css';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './store/user-slice';

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
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index={true} element={<Home />} />
            <Route
              path="game"
              element={user.nickname ? <div>Tetris</div> : <PleaseLogin />}
            />
            <Route path="login" element={<PleaseLogin />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
