/*
Footer component.
*/

import styles from '../../styles/Footer.module.css';
import useMediaQuery from '@mui/material/useMediaQuery';

const Footer = () => {
  const isSmallScreen = useMediaQuery('(max-width:350px)');

  return (
    <div className={styles.footerBasic}>
      <footer>
        <p className={styles.copyright}>
          {!isSmallScreen && (
            <>
              Info Map Fullstack App © 2023 | Frontend assessment |
              <a
                href="https://github.com/jesuisstan/InfoMapApp"
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
        </p>
      </footer>
    </div>
  );
};

export default Footer;
