import { useEffect, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import styles from '../../styles/messenger.module.css';

const Messenger = ({ messages, roomData, hidable }) => {
  const messagesContainerRef = useRef(null);
  const [hidden, setHidden] = useState(false);
  const [buttonMoved, setButtonMoved] = useState(false);

  const toggleHidden = () => {
    setHidden(!hidden);
    setButtonMoved(!buttonMoved);
  };

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
        : roomData.players >= 2
        ? 'var(--TETRIS_WHITE)'
        : 'inherit'
  };

  return (
    <div style={{ position: 'relative' }}>
      {' '}
      {/* This {' '} ensures the button can be positioned relative to this container */}
      <div
        className={`${styles.playersInRoom} ${
          hidden ? styles.transparent : ''
        }`}
        style={playersStyle}
      >
        Players: {roomData.players} / {roomData.maxPlayers}
      </div>
      {hidable && (
        <div
          data-testid="toggle-button"
          className={`${styles.hideButton} ${
            buttonMoved ? styles.hideButtonMoved : ''
          }`}
          onClick={toggleHidden}
        >
          {!hidden ? (
            <CloseIcon titleAccess="Hide the last updates" />
          ) : (
            <ChatIcon
              titleAccess="Show the last updates"
              sx={{ color: 'var(--TETRIS_WHITE)' }}
            />
          )}
        </div>
      )}
      <div className={`${styles.wrapper} ${hidden ? styles.transparent : ''}`}>
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
