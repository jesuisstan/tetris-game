import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/usersRoute.js';
import authRoutes from './routes/authRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();

dotenv.config();

app.use(express.json());

const connect = () => {
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

const MAX_PLAYERS_PER_ROOM = 2; // Change this value based on your requirement

// Room capacity tracking
const roomCapacity = new Map();

// Function to check room capacity and reject if full
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
  socket.on('join', ({ player }) => {
    const roomIsFull = !checkRoomCapacity(player.room);

    if (roomIsFull) {
      // Room is full, reject the player
      socket.emit('roomFull', {
        message: 'The room is full. Please try another room.',
      });
      socket.disconnect();
    } else {
      // Room is not full, let the player join
      socket.join(player.room);

      socket.emit('message', {
        data: {
          player: { nickname: player.nickname, role: player.role },
          message: `Hey from Server (room: ${player.room})`,
        },
      });
    }
  });

  socket.on('disconnect', () => {
    // Decrement room capacity on disconnect
    const room = Object.keys(socket.rooms).find((room) => room !== socket.id);
    if (room) {
      const currentPlayers = roomCapacity.get(room) || 0;
      if (currentPlayers > 0) {
        roomCapacity.set(room, currentPlayers - 1);
      }
    }
    console.log('Disconnect');
  });
});

server.listen(process.env.SERVER_PORT, () => {
  console.log('Server is running on port ' + process.env.SERVER_PORT);
  connect();
});
