import CreateRoomBlock from './CreateRoomBlock';
import JoinRoomBlock from './JoinRoomBlock';

import styles from '../../styles/lobby-page.module.css';

const Lobby = ({ socket }) => {
  return (
    <div className={styles.mainWrapper}>
      {/*<CreateRoomBlock socket={socket} />
      <div style={{ color: 'var(--TETRIS_GREEN)' }}>----- OR -----</div>
      <JoinRoomBlock />*/}

      <div className={styles.sideBlock}>
        <CreateRoomBlock socket={socket} />
      </div>
      {/*<div className={styles.middleBlock}>
        <div style={{ color: 'var(--TETRIS_GREEN)' }}>--- OR ---</div>
      </div>*/}
      <div className={styles.sideBlock}>
        <JoinRoomBlock />
      </div>
    </div>
  );
};

export default Lobby;
