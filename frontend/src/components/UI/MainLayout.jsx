import { Outlet } from 'react-router-dom';
import Menu from './Menu';
import Footer from './Footer';

const MainLayout = ({
  user,
  setUser
}) => {
  return (
    <div>
      <Menu user={user} setUser={setUser} />
      <div style={{ marginTop: '90px' }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
export default MainLayout;
