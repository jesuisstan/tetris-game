import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import FormInput from '../../components/UI/FormInput';
import Stack from '@mui/material/Stack';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import * as MUI from '../../styles/MUIstyles';
import styles from '../../styles/lobby-page.module.css';

const JoinRoomBlock = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    nickname: '',
    room: ''
  });

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
    { id: 'roomName', label: 'Room name', minWidth: 170 },
    {
      id: 'owner',
      label: 'Owner',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toLocaleString('en-US')
    },
    {
      id: 'action',
      label: 'Action',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toLocaleString('en-US')
    }
  ];

  function createData(roomName, owner, action) {
    return { roomName, owner, action };
  }

  const rows = [
    createData('India', 'IN', 1324171354),
    createData('China', 'CN', 1403500365),
    createData('Italy', 'IT', 60483973),
    createData('United States', 'US', 327167434),
    createData('Canada', 'CA', 37602103),
    createData('Australia', 'AU', 25475400),
    createData('Germany', 'DE', 83019200),
    createData('Ireland', 'IE', 4857000),
    createData('Mexico', 'MX', 126577691),
    createData('Japan', 'JP', 126317000),
    createData('France', 'FR', 67022000),
    createData('United Kingdom', 'GB', 67545757),
    createData('Russia', 'RU', 146793744),
    createData('Nigeria', 'NG', 200962417),
    createData('Brazil', 'BR', 210147125)
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '21px'
      }}
    >
      <h1>Join a room</h1>
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
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default JoinRoomBlock;