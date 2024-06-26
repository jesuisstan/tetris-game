import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  emitSocketEvent,
  listenSocketEvent,
  stopListeningSocketEvent
} from '../../store/socket-slice';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TetrisLoader from '../UI/TetrisLoader';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { PersonStanding } from 'lucide-react';
import Diversity3Icon from '@mui/icons-material/Diversity3';

import styles from '../../styles/lobby.module.css';

export const createData = (
  roomName,
  mode,
  admin,
  maxPlayers,
  players,
  adminSocketId,
  state
) => {
  const details = `${players} / ${maxPlayers}`;
  const status = state === true ? 'Playing' : 'Pending';

  return {
    roomName,
    mode,
    admin,
    details,
    players,
    maxPlayers,
    adminSocketId,
    status
  };
};

export const checkAccess = (roomData, socketId) => {
  if (!roomData) return false;
  if (roomData.status === 'Playing') {
    return false;
  } else if (roomData.mode === 'solo') {
    return roomData.adminSocketId === socketId ? true : false;
  } else if (roomData.mode === 'competition') {
    return roomData.maxPlayers === roomData.players ||
      roomData.status === 'Playing'
      ? false
      : true;
  }
};

const JoinRoomBlock = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socketId = useSelector((state) => state.socket.socket).id;
  const user = useSelector((state) => state.user);
  const [roomsList, setRoomsList] = useState(null);
  const [roomURI, setRoomURI] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns = [
    { id: 'roomName', label: 'Name', minWidth: 120 },
    {
      id: 'mode',
      label: 'Mode',
      minWidth: 60,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'admin',
      label: 'Admin',
      minWidth: 120,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'details',
      label: 'Players / Max',
      minWidth: 80,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'access',
      label: 'Access',
      minWidth: 80,
      align: 'center'
    }
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const joinRoom = (roomData) => {
    if (!checkAccess(roomData, socketId)) return;

    setLoading(true);
    const newRoomURI = `/${roomData.roomName}/${user.nickname}`;
    setRoomURI(newRoomURI);
  };

  useEffect(() => {
    if (roomURI !== '') {
      setLoading(false);
      navigate(roomURI);
    }
  }, [roomURI, navigate]);

  useEffect(() => {
    dispatch(emitSocketEvent({ eventName: 'get_rooms_list' }));

    return () => {
      dispatch(
        stopListeningSocketEvent({
          eventName: 'get_rooms_list',
          callback: null
        })
      );
    };
  }, []);

  useEffect(() => {
    dispatch(
      listenSocketEvent({
        eventName: 'update_rooms',
        callback: (data) => {
          const roomsData = data?.roomsList?.map((item) =>
            createData(
              item.name,
              item.mode,
              item.admin.nickname,
              item.maxPlayers,
              item.players,
              item.admin.socketId,
              item.state
            )
          );

          // Reverse the roomsData array before setting it to state
          setRoomsList(roomsData?.reverse() || []);
        }
      })
    );
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '21px'
      }}
    >
      {!roomsList && <TetrisLoader text="Room list is loading..." />}
      {loading && <TetrisLoader text="Joining the room in progress..." />}
      {roomsList && !loading && (
        <div className={styles.table}>
          <Paper sx={{ width: '100%' }}>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          backgroundColor: 'var(--TETRIS_WHITE)'
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roomsList?.length === 0 ? (
                    <TableRow data-testid="no-rooms-available">
                      <TableCell colSpan={columns.length} align="center">
                        No rooms available
                      </TableCell>
                    </TableRow>
                  ) : (
                    roomsList
                      ?.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.roomName}
                            onClick={() => joinRoom(row)}
                            style={{ cursor: 'pointer' }}
                          >
                            {columns.map((column) => {
                              const value = row[column.id];
                              if (column.id === 'access') {
                                return (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                  >
                                    <SportsEsportsIcon
                                      data-testid="access-icon"
                                      sx={{
                                        color: checkAccess(row, socketId)
                                          ? 'var(--TETRIS_GREEN)'
                                          : 'var(--TETRIS_RED)'
                                      }}
                                    />
                                  </TableCell>
                                );
                              }
                              if (column.id === 'mode') {
                                return (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                    title={row.mode}
                                  >
                                    {row.mode === 'solo' ? (
                                      <PersonStanding />
                                    ) : (
                                      <Diversity3Icon />
                                    )}
                                  </TableCell>
                                );
                              }
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={roomsList?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              style={{
                backgroundColor: 'var(--TETRIS_WHITE)'
              }}
            />
          </Paper>
        </div>
      )}
    </div>
  );
};

export default JoinRoomBlock;
