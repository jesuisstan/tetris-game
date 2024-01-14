import styles from '../styles/not-found.module.css';

const NotFound = () => {
  return (
    <div className={styles.basic}>
      <div className={styles.glitch}>
        <h1>404</h1>
        <h1>Not Found</h1>
      </div>
    </div>
  );
};

export default NotFound;
