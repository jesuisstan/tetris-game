import CreateRoomBlock from './CreateRoomBlock';
import JoinRoomBlock from './JoinRoomBlock';

import styles from '../../styles/lobby-page.module.css';

const Lobby = () => {
  return (
    <div className={styles.mainWrapper}>
      <CreateRoomBlock />
      <div style={{ color: 'var(--TETRIS_GREEN)' }}>----- OR -----</div>
      <JoinRoomBlock />
    </div>
  );
};

export default Lobby;
