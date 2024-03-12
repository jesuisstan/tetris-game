import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/usersRoute.js';
import authRoutes from './routes/authRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import Player from './classes/Player.js';
import Game from './classes/Game.js';
import Tetromino from './classes/Tetromino.js';
import PlayersList from './classes/PlayersList.js';

dotenv.config();

export const MAX_PLAYERS_IN_ROOM =
  Number(process.env.REACT_APP_MAX_PLAYERS_IN_ROOM) || 4;

let roomsList = [];
let GameTetris = new Game();
let playersList = new PlayersList();

const app = express();
app.use(express.json());

const connectToDatabase = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log('Connected to DB');
    })
    .catch((err) => {
      throw err;
    });
};

// Configure CORS middleware
app.use(
  cors({
    origin: `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_FRONTEND_PORT}`,
    //methods: 'GET,POST,PUT,DELETE',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);

// middlewares:
app.use(cookieParser());

app.use('/api/check', (req, res) => {
  res.send('Hello from Tetris server');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// error handler:
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';
  return res.status(status).json({
    success: false,
    status,
    message
  });
});

// adjust socket logic:
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    //origin: "*",
    origin: `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_FRONTEND_PORT}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
  //path: '/socket'
});

app.get('/rooms', (req, res) => {
  res.send(roomsList);
});

io.on('connection', async (socket) => {
  try {
    // Initialize an empty send buffer for each socket connection:
    socket.sendBuffer = [];
    console.log(
      'A new client connected from:',
      socket.handshake.headers.referer
    );
  } catch (error) {
    // Catch and log any errors that might occur during initialization:
    console.error(error.message);
  }

  socket.on('user_logged_in', async (data) => {
    try {
      // Create a new Player instance with the received data
      const newPlayer = new Player(data, socket.id); // todo data should contain socketId
      playersList.addNewPlayer(newPlayer);
      console.log('playersList:', playersList); // todo delete
      // Emit a welcome message to the client
      socket.emit('welcome', {
        message: `Welcome, ${newPlayer.nickname}!`
      });
    } catch (error) {
      console.error('Error creating new player:', error);
      socket.emit('welcome_error');
    }
  });

  //socket.on('join_room', ({ player }) => {
  //  const roomIsFull = !checkRoomCapacity(player.room);

  //  if (roomIsFull) {
  //    // Room is full, reject the player
  //    socket.emit('roomFull', {
  //      message: 'The room is full. Please try another room.'
  //    });
  //    //socket.disconnect(); // todo
  //  } else {
  //    // Room is not full, let the player join
  //    socket.join(player.room);

  //    socket.emit('message', {
  //      data: {
  //        player: { nickname: player.nickname, role: player.role },
  //        message: `Hey from Server (room: ${player.room})`
  //      }
  //    });
  //  }
  //});

  socket.on('disconnect', () => {
    GameTetris.handleLeavingRoom(io, socket, playersList, roomsList).then(
      (res) => {
        if (res.status) {
          roomsList = res.roomsList;
          playersList.erasePlayer(res.playerToErase);
          console.log(`${res.playerToErase} disconnected`);
        }
      }
    );
  });

  socket.on('create_user_room', async (data) => {
    const existingPlayer = playersList.find(
      (p) => p.nickname === data.nickname
    );
    const currentSocketPlayer = playersList.find(
      (p) => p.nickname === data.nickname && p.socketId === socket.id
    );

    if (currentSocketPlayer === undefined && existingPlayer?.nickname) {
      io.to(socket.id).emit('cannot_add_user', { res: true });
    }

    if (currentSocketPlayer === undefined && !existingPlayer?.nickname)
      playersList.updatePlayers(socket, data).then((res) => {
        //playersList = res; // todo no need?
        const rm = roomsList.find((room) => room.name === data.room);
        if (rm === undefined) {
          roomsList = [
            ...roomsList,
            {
              name: data.room,
              mode: 'solo',
              maxPlayers: 1,
              players: 1,
              state: false
            }
          ];
          GameTetris.handleCreatingRoom(io, socket, playersList, data.room);
          console.log('roomsList', roomsList); // todo delete
          io.emit('update_rooms', { roomsList });
        } else if (
          rm.mode === 'competition' &&
          rm.state === false &&
          rm.players < MAX_PLAYERS_IN_ROOM
        ) {
          GameTetris.handleJoiningRoom(
            io,
            socket,
            rm.name,
            playersList,
            roomsList
          );
        } else {
          io.to(socket.id).emit('join_denied'); // todo was "joined_denided"
        }
      });
    else {
      io.to(socket.id).emit('disconnected');
    }
  });

  socket.on('create_room', async (data) => {
    const rm = roomsList.find((rom) => rom.name === data.room);
    if (rm === undefined) {
      roomsList = [
        ...roomsList,
        {
          name: data.room,
          mode: data.gameMode,
          maxPlayers: data.gameMode === 'solo' ? 1 : MAX_PLAYERS_IN_ROOM,
          playersList: 1,
          state: false
        }
      ];
      GameTetris.handleCreatingRoom(io, socket, playersList, data.room);
      console.log('roomsList', roomsList); // todo delete

      io.emit('update_rooms', { roomsList });
    } else {
      io.to(socket.id).emit('room_already_exists');
    }
  });

  socket.on('join_room', (data) => {
    GameTetris.handleJoiningRoom(io, socket, data, roomsList, playersList);
    io.emit('room_joined', data);
  });

  socket.on('leave_room', () => {
    // todo was 'leaveRoom'
    GameTetris.handleLeavingRoom(io, socket, playersList, roomsList).then(
      (res) => {
        if (res.status) roomsList = res.roomsList;
      }
    );
  });

  socket.on('startgame', async (data) => {
    const room = roomsList.find((room) => room.name === data.room);
    GameTetris.getRoomAdmin(io, socket.id, room, playersList).then(
      async (user) => {
        if (user.admin) {
          const tetriminos = await Tetromino.getTetriminos();
          GameTetris.startGame(io, room, tetriminos);
          io.emit('update_rooms', roomsList);
        } else {
          io.to(socket.id).emit('wait_admin');
        }
      }
    );
    io.emit('game_started');
  });

  socket.on('newTetriminos', async (data) => {
    const tetriminos = await Tetromino.getTetriminos();
    GameTetris.newTetriminos(io, data.room, tetriminos);
  });

  socket.on('Stage', (data) => {
    const player = playersList.find((p) => p.nickname === data.nickname);
    if (player && player.room === data.roomName)
      GameTetris.sendStage(io, data.roomName, data.stage, data.nickname);
  });

  socket.on('checkStages', async (data) => {
    GameTetris.checkStages(io, data.Stages, data.stage, data.room);
  });

  socket.on('toggle_game_mode', async (data) => {
    // todo was "updateroomMode"
    GameTetris.toggleGameMode(io, data, roomsList);
  });

  socket.on('game_over', async (data) => {
    // todo was "Game_over"
    GameTetris.handleGameOver(io, data, playersList, roomsList);
  });

  socket.on('add_penalty', async (data) => {
    GameTetris.addPenalty(socket, data.room);
  });
});

server.listen(process.env.SERVER_PORT, () => {
  console.log('Server is running on port ' + process.env.SERVER_PORT);
  connectToDatabase();
});
