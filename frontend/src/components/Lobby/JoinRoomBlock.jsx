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

import {
  emitEvent,
  getSocket,
  listenEvent
} from '../../socket/socketMiddleware';

import * as MUI from '../../styles/MUIstyles';
import styles from '../../styles/lobby.module.css';

const JoinRoomBlock = () => {
  const navigate = useNavigate();
  //const roomsList = useSelector((state) => state.roomsList);
  //const savedRoomsState = JSON.parse(localStorage.getItem('roomsList'));
  const [roomsList, setRoomsList] = useState(null);

  const [soc, setSoc] = useState(getSocket());

  //let roomsList = [];
  console.log('getSocket: ', soc);
  //const onChange = (event) => {
  //  const { name, value } = event.target;
  //  let modifiedValue = value.replace(/\s/g, '');
  //  setValues({ ...values, [name]: modifiedValue });
  //};

  //const joinRoom = (event) => {
  //  event.preventDefault();
  //  setLoading(true);
  //  const roomUri = `/tetris/${values.room}[${values.nickname}]`;
  //  navigate(roomUri);
  //};

  const columns = [
    { id: 'roomName', label: 'Room name', minWidth: 150 },
    {
      id: 'mode',
      label: 'Game mode',
      minWidth: 150,
      align: 'right',
      format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'players',
      label: 'Players',
      minWidth: 150,
      align: 'right',
      format: (value) => value.toLocaleString('en-US')
    }
  ];

  const createData = (roomName, mode, players) => {
    return { roomName, mode, players };
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    emitEvent('get_rooms_list', null);
    console.log('soc off GET');
  }, [soc]);

  useEffect(() => {
    listenEvent('update_rooms', (data) => {
      // Listening for update_rooms event

      const roomsData =
        data?.roomsList?.map((item) =>
          createData(item.name, item.mode, item.players)
        );

      console.log('roomsData----------', roomsData);
      console.log('soc off SEEEEEEEEt');

      //dispatch(setRoomsList(roomsData));
      //localStorage.setItem('roomsList', JSON.stringify(roomsData));
      //setRows(roomsData);
      setRoomsList(roomsData);
    });
  }, [soc]);

  const joinRoom = (roomName) => {
    emitEvent('join_room', { roomName }); // Emitting join_room event
  };
  //console.log('rows JOIN', rows);
  console.log('roomsList JOIN', roomsList);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '21px'
      }}
    >
      {!roomsList ? (
        <>
          <p style={{ color: 'var(--TETRIS_WHITE)' }}>Room list is </p>
          <TetrisLoader />
        </>
      ) : (
        <Paper sx={{ width: '100%' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
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
