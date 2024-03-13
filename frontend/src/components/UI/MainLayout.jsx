import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Menu from './Menu';
import Footer from './Footer';
import TetrisLoader from './TetrisLoader';

const MainLayout = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 1 seconds
    }, 1000);

    return () => {
      clearTimeout(timer); // Clear the timer if component unmounts before 1 seconds
    };
  }, []);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <Menu />
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1
          }}
        >
          <TetrisLoader />
        </div>
      ) : (
        <main
          style={{
            flexGrow: 1,
            marginTop: '50px',
            marginBottom: '21px',
            position: 'relative'
          }}
        >
          <Outlet />
        </main>
      )}
      <Footer />
    </div>
  );
};

export default MainLayout;
