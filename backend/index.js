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

const MAX_PLAYERS_PER_ROOM = 2;

let Players = [];
let Rooms = [];
let GameTetris = new Game();

const app = express();
app.use(express.json());

dotenv.config();

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
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
  })
);

//middlewares
app.use(cookieParser());

app.use('/api/check', (req, res) => {
  res.send('Hello from Tetris server');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

//error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';
  return res.status(status).json({
    success: false,
    status,
    message
  });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_FRONTEND_PORT}`,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
  }
});

// Room capacity tracking
const roomCapacity = new Map();
console.log('roomCapacity', roomCapacity)
// Function to check Rooms capacity and reject if full
const checkRoomCapacity = (room) => {
  const currentPlayers = roomCapacity.get(room) || 0;

  if (currentPlayers >= MAX_PLAYERS_PER_ROOM) {
    return false;
  } else {
    roomCapacity.set(room, currentPlayers + 1);
    return true;
  }
};

io.on('connection', (socket) => {
  socket.on('user_logged_in', async (data) => {
    try {
      // Create a new Player instance with the received data
      const newPlayer = new Player(data);
      Players.push(newPlayer);

      console.log('Playersssssssssss: ', Players);

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

  //socket.on('disconnect', () => {
  //  // Decrement room capacity on disconnect
  //  const room = Object.keys(socket.Rooms).find((room) => room !== socket.id);
  //  console.log('room', room)
  //  if (room) {
  //    const currentPlayers = roomCapacity.get(room) || 0;
  //    if (currentPlayers > 0) {
  //      roomCapacity.set(room, currentPlayers - 1);
  //    }
  //  }
  //  console.log('Disconnect');
  //});


  socket.on("create_user_room", async (data) => {
    const oldplyr = Players.find((p) => p.name === data.username);
    const plyr = Players.find((p) => p.name === data.username && p.socketId === socket.id);

    if (plyr === undefined && oldplyr?.name) {
      io.to(socket.id).emit("cannot_add_user", { res: true });
    }
    
    if (plyr === undefined && !oldplyr?.name)
      player.updatePlayer(io, socket, data, Players).then((res) => {
        Players = res;
        const rm = Rooms.find((room) => room.name === data.room);
        if (rm === undefined) {
          Rooms = [...Rooms, { name: data.room, state: false, mode: "solo", maxplayers: 1, Players: 1 }];
          GameTetris.createRoom(io, socket, data.room, Players);
          io.emit("update_rooms", Rooms);
        } else if (rm.mode === "batlle" && rm.Players < 5 && rm.state === false) {
          GameTetris.joinRoom(io, socket, rm.name, Rooms, Players);
        } else {
          io.to(socket.id).emit("joined_denided");
        }
      });
    else
      io.to(socket.id).emit("disconnected");

  });

  socket.on("disconnect", () => {
    GameTetris.leaveRoom(io, socket, Rooms, Players).then((res) => {
      if (res.status) {
        Rooms = res.Rooms;
        player.deletePlayer(res.playerremoved, Players).then((res) => {
          Players = res;
        });
      }
    });
  });

  socket.on("send_message", async (data) => {
    GameTetris.sendMessage(io, data);
    io.emit("message", data);
  });

  socket.on("create_room", async (data) => {
    const rm = Rooms.find(rom => rom.name === data);
    if (rm === undefined) {
      Rooms = [...Rooms, { name: data, state: false, mode: "solo", maxplayers: 1, Players: 1 }];
      GameTetris.createRoom(io, socket, data, Players);
      io.emit("update_rooms", Rooms);
    }
    else{
      io.to(socket.id).emit("room_exist");
    }
  });

  socket.on("join_room", (data) => {
    GameTetris.joinRoom(io, socket, data, Rooms, Players);
    io.emit("room_joined", data);
  });

  socket.on("leaveRoom", () => {
    GameTetris.leaveRoom(io, socket, Rooms, Players).then((res) => {
      if (res.status) Rooms = res.Rooms;
    });
  });

  socket.on("startgame", async (data) => {
    const room = Rooms.find((room) => room.name === data.room);
    GameTetris.getUser(io, socket.id, room, Players).then(async (user) => {
      if (user.admin) {
        const tetriminos = await tetrimios.getTetriminos();
        GameTetris.startGame(io, room, tetriminos);
        io.emit("update_rooms", Rooms);
      } else {
        io.to(socket.id).emit("wait_admin");
      }
    });
    io.emit("game_started");
  });

  socket.on("newTetriminos", async (data) => {
    const tetriminos = await tetrimios.getTetriminos();
    GameTetris.newTetriminos(io, data.room, tetriminos);
  });

  socket.on("Stage", (data) => {
    const player = Players.find((p) => p.name === data.username);
    if (player && player.room === data.roomName) GameTetris.sendStage(io, data.roomName, data.stage, data.username);
  });

  socket.on("checkStages", async (data) => {
    GameTetris.checkStages(io, data.Stages, data.stage, data.room);
  });

  socket.on("updateroomMode", async (data) => {
    GameTetris.updateroomMode(io, data, Rooms);
  });

  socket.on("Game_over", async (data) => {
    GameTetris.GameOver(io, data, Rooms, Players);
  });
  
  socket.on("add_penalty", async (data) => {
    GameTetris.addPenalty(socket, data.room);
  });
});

server.listen(process.env.SERVER_PORT, () => {
  console.log('Server is running on port ' + process.env.SERVER_PORT);
  connectToDatabase();
});
