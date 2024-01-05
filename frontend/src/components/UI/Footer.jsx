/*
Footer component.
*/

import useMediaQuery from '@mui/material/useMediaQuery';

import styles from '../../styles/footer.module.css';

const Footer = () => {
  const isSmallScreen = useMediaQuery('(max-width:521px)');

  return (
    <div className={styles.footerBasic}>
      <footer>
        <p className={styles.copyright}>
          {!isSmallScreen && (
            <>
              Tetris Game Fullstack App © 2024 |
              <a
                href="https://github.com/jesuisstan/tetris-game"
                className={styles.footerLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {` @github`}
              </a>
              {` | `}
            </>
          )}
          {`Created by `}
          <a
            href="http://krivtsoff.me/"
            className={styles.footerLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Stan Krivtsoff
          </a>
          {` & `}
          <a
            href="https://www.linkedin.com/in/rustam-khafizov-7944971bb/"
            className={styles.footerLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Rustam Khafizov
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Footer;
