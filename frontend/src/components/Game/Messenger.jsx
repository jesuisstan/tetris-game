import { useEffect, useState, useRef } from 'react';

import { listenEvent, stopListeningEvent } from '../../socket/socketMiddleware';

import styles from '../../styles/messenger.module.css';

const Messenger = ({ messages }) => {
  const messagesEndRef = useRef(null);
console.log('messages',messages)
  // Scroll to the bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.wrapper}>
      <p>Last updates:</p>
      {messages?.length === 0 && (
        <p className={styles.singleMessage}>No news</p>
      )}
      <ul className={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <li key={index} className={styles.message}>
            {msg}
          </li>
        ))}
        <div ref={messagesEndRef} />{' '}
        {/* Empty div used as a marker for scrolling */}
      </ul>
    </div>
  );
};

export default Messenger;
