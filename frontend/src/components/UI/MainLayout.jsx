import { Outlet } from 'react-router-dom';
import Menu from './Menu';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import TetrisLoader from './TetrisLoader';

const MainLayout = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 3 seconds
    }, 2000);

    return () => {
      clearTimeout(timer); // Clear the timer if component unmounts before 3 seconds
    };
  }, []);

  return (
    <div>
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          <TetrisLoader />
        </div>
      ) : (
        <div>
          <Menu />
          <div style={{ marginTop: '90px' }}>
            <Outlet />
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};
export default MainLayout;
