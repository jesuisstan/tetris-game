import { useEffect, useRef } from 'react';

import styles from '../../styles/messenger.module.css';

const Messenger = ({ messages, roomData }) => {
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  const parseMessage = (messageData, index) => {
    if (messageData.nickname) {
      return (
        <span key={index}>
          <span style={{ color: 'var(--TETRIS_GREEN)' }}>
            {messageData.nickname}{' '}
          </span>
          {messageData.message}
        </span>
      );
    } else {
      return <span key={index}>{messageData.message}</span>;
    }
  };

  const playersStyle = {
    color:
      roomData.players === roomData.maxPlayers
        ? 'var(--TETRIS_GREEN)'
        : 'inherit'
  };

  return (
    <div style={{ position: 'relative' }}>
      {' '}
      {/* This ensures the button can be positioned relative to this container */}
      <div className={styles.playersInRoom} style={playersStyle}>
        Players: {roomData.players} / {roomData.maxPlayers}
      </div>
      <div className={styles.wrapper}>
        <p>Last updates:</p>
        {messages.length === 0 && (
          <p className={styles.singleMessage}>No news</p>
        )}
        <ul className={styles.messagesContainer} ref={messagesContainerRef}>
          {messages.map((messageData, index) => (
            <li key={index} className={styles.message}>
              {parseMessage(messageData, index)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Messenger;
