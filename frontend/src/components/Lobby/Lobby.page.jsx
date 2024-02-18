import CreateRoomBlock from './CreateRoomBlock';
import JoinRoomBlock from './JoinRoomBlock';

import styles from '../../styles/lobby-page.module.css';

const Lobby = () => {
  return (
    <div className={styles.mainWrapper}>
      <CreateRoomBlock />
      - OR -
      <JoinRoomBlock />
    </div>
  );
};

export default Lobby;
