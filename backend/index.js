import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/users-route.js';
import authRoutes from './routes/auth-route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import PlayersList from './models/PlayersList.js';
import RoomsList from './models/RoomsList.js';
import Game from './models/Game.js';
import manageSocket from './socket-manager.js';

dotenv.config();

export const MAX_PLAYERS_IN_ROOM =
  Number(process.env.REACT_APP_MAX_PLAYERS_IN_ROOM) || 3;

// Declare and export basic game vars:
export let roomsList = new RoomsList();
export let gameTetris = new Game();
export let playersList = new PlayersList();

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

// Set up socket connection
const server = http.createServer(app);
manageSocket(server);

app.get('/rooms', (req, res) => {
  res.send(roomsList);
});

server.listen(process.env.SERVER_PORT, () => {
  console.log('Server is running on port ' + process.env.SERVER_PORT);
  connectToDatabase();
});
