import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { congratsAlert } from '../../utils/alerts';

const TetrisConfetti = ({ show, setShow }) => {
  const [windowSizes, setWindowSizes] = useState({
    width: window.innerWidth - 10,
    height:
      window.innerWidth < 1040 ? window.innerHeight * 1.9 : window.innerHeight
  });

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSizes({
        width: window.innerWidth - 10,
        height:
          window.innerWidth < 1040
            ? window.innerHeight * 1.9
            : window.innerHeight
      });
    };

    if (show) {
      congratsAlert();
      window.addEventListener('resize', handleWindowResize);
    } else {
      window.removeEventListener('resize', handleWindowResize);
    }

    // Clear the timeout if show becomes false
    const timeoutId = setTimeout(() => {
      setShow(false);
    }, 42000);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [show, setShow]);

  return (
    show && (
      <Confetti
        size={8}
        shape="circle"
        colors={[
          'rgb(238, 227, 193)',
          'rgb(208, 2, 27)',
          'rgb(0, 186, 188)',
          'rgb(199, 97, 100)',
          'rgb(119, 136, 153)'
        ]}
        wind={0.05}
        gravity={0.2}
        width={windowSizes.width}
        height={windowSizes.height}
      />
    )
  );
};

export default TetrisConfetti;
