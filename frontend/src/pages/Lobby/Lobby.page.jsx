import InvitationBlock from './InvitationBlock';
import JoinRoomBlock from './JoinRoomBlock';

import styles from '../../styles/lobby-page.module.css';

const Lobby = () => {
  return (
    <div className={styles.mainWrapper}>
      <InvitationBlock />
      - OR -
      <JoinRoomBlock />
    </div>
  );
};

export default Lobby;
