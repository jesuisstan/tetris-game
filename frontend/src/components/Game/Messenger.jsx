import { useEffect, useRef } from 'react';

import styles from '../../styles/messenger.module.css';

const Messenger = ({ messages }) => {
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <div className={styles.wrapper}>
      <p>Last updates:</p>
      {messages?.length === 0 && (
        <p className={styles.singleMessage}>No news</p>
      )}
      <ul className={styles.messagesContainer} ref={messagesContainerRef}>
        {messages.map((msg, index) => (
          <li key={index} className={styles.message}>
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messenger;
