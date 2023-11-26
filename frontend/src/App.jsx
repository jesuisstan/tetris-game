import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.page';
import NotFound from './pages/NotFound.page';
import MainLayout from './components/UI/MainLayout';
import PleaseLogin from './components/Login/PleaseLogin';
import * as utils from './utils/authHandlers';
import './styles/index.css';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './redux/actions/userActions';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state);

  //const [user, setUser] = useState({
  //  _id: '',
  //  nickname: '',
  //  email: '',
  //  firstName: '',
  //  lastName: ''
  //});

  ////fetch user data from database
  //useEffect(() => {
  //  utils.getUserData(setUser);
  //}, []);

  //fetch user data from database
  useEffect(() => {
    utils.getUserData(dispatch);
  }, [dispatch]);

console.log(user)
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<MainLayout />}
          >
            <Route index={true} element={<Home />} />
            <Route
              path="game"
              element={
                user.nickname ? (
                  <div>Tetris</div>
                ) : (
                  <PleaseLogin />
                )
              }
            />
            <Route path="login" element={<PleaseLogin  />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
