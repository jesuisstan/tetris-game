import styles from '../../styles/magic-btn.module.css';

const MagicButton = ({ text, action }) => {
  return (
    <div
      className={styles.magic}
      onClick={() => {
        action();
      }}
    >
      {text}
    </div>
  );
};

export default MagicButton;
