import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingButton from '@mui/lab/LoadingButton';
import InvitationBlock from './InvitationBlock';
import JoinRoomBlock from './JoinRoomBlock';

import styles from '../../styles/lobby-page.module.css';

const Lobby = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  return (
    <div className={styles.mainWrapper}>
      <InvitationBlock />
      OR
      <JoinRoomBlock />
    </div>
  );
};

export default Lobby;
