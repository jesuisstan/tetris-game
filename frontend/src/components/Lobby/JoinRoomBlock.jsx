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

import * as MUI from '../../styles/MUIstyles';
import styles from '../../styles/lobby.module.css';

const JoinRoomBlock = ({ socket }) => {
  const navigate = useNavigate();
  //const [roomsList, setRoomsList] = useState([]);
  let roomsList = [];
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

  function createData(roomName, mode, players) {
    return { roomName, mode, players };
  }

  const [rows, setRows] = useState([]);
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
    socket.on('update_rooms', (data) => {
      setRows(
        data.roomsList.map((item) =>
          createData(item.name, item.mode, item.playersList)
        )
      );

      console.log('data.roomsList', data.roomsList);

      console.log('updated RoomsList', roomsList);
    });
  }, [socket]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '21px'
      }}
    >
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
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                            onClick={() => console.log('clicked row')}
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
          count={rows.length}
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
  );
};

export default JoinRoomBlock;
