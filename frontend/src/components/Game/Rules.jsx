import styles from '../../styles/rules.module.css';

const Rules = () => {
  return (
    <div className={styles.wrapper}>
      <p>Notes*:</p>
      <ul className={styles.rulesContainer}>
        <li key={1} className={styles.rule}>
          Press ⬅️/⬇️/➡️ to move a tetromino
        </li>
        <li key={2} className={styles.rule}>
          Press ⬆️ to rotate a tetromino
        </li>{' '}
        <li key={3} className={styles.rule}>
          Press <strong style={{ color: 'var(--TETRIS_GREEN)' }}>Space</strong>{' '}
          to fast drop a tetromino
        </li>{' '}
        <li key={4} className={styles.rule}>
          Press <strong style={{ color: 'var(--TETRIS_GREEN)' }}>Q</strong> to
          quit the game round
        </li>
        <li key={5} className={styles.rule}>
          Press <strong style={{ color: 'var(--TETRIS_GREEN)' }}>Escape</strong>{' '}
          to leave the room
        </li>
        <li key={6} className={styles.rule}>
          Leave the game page = Leave the room
        </li>
      </ul>
      <span className={styles.comment}>* during the game</span>
    </div>
  );
};

export default Rules;
