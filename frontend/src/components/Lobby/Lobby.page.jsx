import CreateRoomBlock from './CreateRoomBlock';
import JoinRoomBlock from './JoinRoomBlock';
import DeviderTetris from '../UI/DeviderTetris';

import styles from '../../styles/lobby.module.css';

const Lobby = () => {
  return (
    <div className={styles.lobbyCard}>
      <h1>Game lobby</h1>
      <div className={styles.wrapper}>
        <div>
          <h2 className={styles.leftHeader}>Create room</h2>
          <div className={styles.left}>
            <CreateRoomBlock />
          </div>
        </div>

        <div className={styles.deviderTetris}>
          <DeviderTetris />
        </div>

        <div>
          <h2 className={styles.rightHeader}>Join room</h2>
          <div className={styles.right}>
            <JoinRoomBlock />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
