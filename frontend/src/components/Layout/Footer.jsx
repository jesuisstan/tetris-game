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
              Red Tetris Game © 2024 |
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
            href="https://www.krivtsoff.site/"
            className={styles.footerLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Stan Krivtsoff
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Footer;
