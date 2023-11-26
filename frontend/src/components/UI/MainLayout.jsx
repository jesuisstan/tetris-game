import { Outlet } from 'react-router-dom';
import Menu from './Menu';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div>
      <Menu />
      <div style={{ marginTop: '90px' }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
export default MainLayout;
