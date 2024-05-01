import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';

import { listenEvent, stopListeningEvent } from '../../socket/socketMiddleware';

import styles from '../../styles/messenger.module.css';

const Messenger = () => {
  const user = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleNewMessage = ({ message }) => {
      console.log('Chat message from server:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    listenEvent('chat', handleNewMessage);

    return () => {
      // Clean up event listener when component unmounts
      stopListeningEvent('chat', null);
    };
  }, []);

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
