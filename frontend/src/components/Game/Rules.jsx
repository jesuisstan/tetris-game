import styles from '../../styles/messenger.module.css';

const Rules = () => {
  return (
    <div className={styles.wrapper}>
      <p>Notes:</p>
      <ul className={styles.messagesContainer}>
        <li key={1} className={styles.message}>
          Press ⬅️/⬇️/➡️ to move a tetromino
        </li>
        <li key={2} className={styles.message}>
          Press ⬆️ to rotate a tetromino
        </li>{' '}
        <li key={3} className={styles.message}>
          Press "Space" to fast drop a tetromino
        </li>{' '}
        <li key={4} className={styles.message}>
          Press "Q" to quit the game round
        </li>
        <li key={5} className={styles.message}>
          Press "Escape" to leave the room
        </li>
        <li key={6} className={styles.message}>
          Leave the game page = Leave the room
        </li>
      </ul>
    </div>
  );
};

export default Rules;
