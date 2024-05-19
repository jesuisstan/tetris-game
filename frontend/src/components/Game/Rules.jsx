import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';

import styles from '../../styles/rules.module.css';

const Rules = () => {
  const [hidden, setHidden] = useState(false);
  const [buttonMoved, setButtonMoved] = useState(false);

  const toggleHidden = () => {
    setHidden(!hidden);
    setButtonMoved(!buttonMoved);
  };

  return (
    <div style={{ position: 'relative' }}>
      {' '}
      {/* This ensures the button can be positioned relative to this container */}
      <div
        className={`${styles.hideButton} ${
          buttonMoved ? styles.hideButtonMoved : ''
        }`}
        onClick={toggleHidden}
      >
        {!hidden ? (
          <CloseIcon titleAccess="Hide the notes" />
        ) : (
          <DescriptionIcon
            titleAccess="Show the notes"
            sx={{ color: 'var(--TETRIS_WHITE)' }}
          />
        )}
      </div>
      <div className={`${styles.wrapper} ${hidden ? styles.transparent : ''}`}>
        <p>Notes*:</p>
        <ul className={styles.rulesContainer}>
          <li key={1} className={styles.rule}>
            Press ⬅️/⬇️/➡️ to move a tetromino.
          </li>
          <li key={2} className={styles.rule}>
            Press ⬆️ to rotate a tetromino.
          </li>
          <li key={3} className={styles.rule}>
            Press <span style={{ color: 'var(--TETRIS_GREEN)' }}>Space</span> to
            fast drop a tetromino.
          </li>
          <li key={4} className={styles.rule}>
            Press <span style={{ color: 'var(--TETRIS_GREEN)' }}>Q</span> to
            quit the game round.
          </li>
          <li key={5} className={styles.rule}>
            Press <span style={{ color: 'var(--TETRIS_GREEN)' }}>Escape</span>{' '}
            to leave the room.
          </li>
          <li key={6} className={styles.rule}>
            Leave the game page = Leave the room.
          </li>
        </ul>
        <span className={styles.comment}>* during the game</span>
      </div>
    </div>
  );
};

export default Rules;
