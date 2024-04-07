import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TetrisLoader from '../UI/TetrisLoader';
import errorAlert from '../../utils/error-alert';

import { useSelector } from 'react-redux';

import { emitEvent, listenEvent } from '../../socket/socketMiddleware';

const JoinRoomBlock = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [roomsList, setRoomsList] = useState(null);
  const [roomURI, setRoomURI] = useState('');
  const [loading, setLoading] = useState(false);

  //const joinRoom = (event) => {
  //  event.preventDefault();
  //  setLoading(true);
  //  const roomUri = `/tetris/${values.room}[${values.nickname}]`;
  //  navigate(roomUri);
  //};

  const joinRoom = (roomName) => {
    setRoomURI(`/tetris/${roomName}[${user.nickname}]`);
    setLoading(true);
    emitEvent('join_room', { roomName }); // Emitting join_room event
  };

  /* Table with rooms list adjusting */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns = [
    { id: 'roomName', label: 'Room name', minWidth: 150 },
    {
      id: 'mode',
      label: 'Game mode',
      minWidth: 150,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'maxPlayers',
      label: 'Max 👫',
      minWidth: 50,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'players',
      label: 'Players',
      minWidth: 50,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    }
  ];

  const createData = (roomName, mode, maxPlayers, players) => {
    return { roomName, mode, maxPlayers, players };
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  /* Socket moves */
  useEffect(() => {
    emitEvent('get_rooms_list', null);
  }, []);

  useEffect(() => {
    // Listening for update_rooms event
    listenEvent('update_rooms', (data) => {
      const roomsData = data?.roomsList?.map((item) =>
        createData(item.name, item.mode, item.maxPlayers, item.players)
      );

      // Reverse the roomsData array before setting it to state
      setRoomsList(roomsData?.reverse() || []);
    });

    // Listen for "join_denied" events
    listenEvent('join_denied', (data) => {
      setLoading(false);
      errorAlert(data?.message ?? 'Something went wrong');
    });
  }, []);

  useEffect(() => {
    // Listen for "room_joined" event
    listenEvent('room_joined', () => {
      setLoading(false);
      navigate(roomURI); // Navigate after receiving acknowledgment
    });
  }, [roomURI]);

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
                {roomsList
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.roomName}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              onClick={() => joinRoom(row.roomName)}
                              sx={{ cursor: 'pointer' }}
                            >
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
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
      )}
    </div>
  );
};

export default JoinRoomBlock;
