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
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

import { useSelector } from 'react-redux';

import { emitEvent, listenEvent } from '../../socket/socketMiddleware';

const JoinRoomBlock = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [roomsList, setRoomsList] = useState(null);
  const [roomURI, setRoomURI] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns = [
    { id: 'roomName', label: 'Room name', minWidth: 142 },
    {
      id: 'mode',
      label: 'Game mode',
      minWidth: 142,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'admin',
      label: 'Admin',
      minWidth: 142,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'details',
      label: 'Players / Max',
      minWidth: 142,
      align: 'center',
      format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'joinButton',
      label: 'Join',
      minWidth: 100,
      align: 'center'
    }
  ];

  const createData = (roomName, mode, admin, maxPlayers, players) => {
    const details = `${players} / ${maxPlayers}`;
    return { roomName, mode, admin, details, players, maxPlayers };
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const joinRoom = (roomName) => {
    setLoading(true);
    const newRoomURI = `/tetris/${roomName}[${user.nickname}]`;
    setRoomURI(newRoomURI);
  };

  useEffect(() => {
    if (roomURI !== '') {
      setLoading(false);
      navigate(roomURI);
    }
  }, [roomURI, navigate]);

  useEffect(() => {
    emitEvent('get_rooms_list', null);
  }, []);

  useEffect(() => {
    // Listening for update_rooms event
    listenEvent('update_rooms', (data) => {
      console.log('data-------------', data)
      const roomsData = data?.roomsList?.map((item) =>
        createData(
          item.name,
          item.mode,
          item.admin.nickname,
          item.maxPlayers,
          item.players
        )
      );

      // Reverse the roomsData array before setting it to state
      setRoomsList(roomsData?.reverse() || []);
    });
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
                          if (column.id === 'joinButton') {
                            // Render join button
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <button
                                  disabled={
                                    row.mode === 'solo' ||
                                    row.maxPlayers === row.players
                                  }
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => joinRoom(row.roomName)}
                                >
                                  <SportsEsportsIcon
                                    sx={{
                                      color:
                                        row.mode === 'solo' ||
                                        row.maxPlayers === row.players
                                          ? 'var(--TETRIS_RED)'
                                          : 'var(--TETRIS_GREEN)'
                                    }}
                                  />
                                </button>
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
