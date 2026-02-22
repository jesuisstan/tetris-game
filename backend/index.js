import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/users-route.js';
import authRoutes from './routes/auth-route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import PlayersList from './classes/PlayersList.js';
import RoomsList from './classes/RoomsList.js';
import Game from './classes/Game.js';
import Tetromino from './classes/Tetromino.js';
import manageSocket from './socket-manager.js';

dotenv.config();

const parsedMaxPlayers = Number(process.env.REACT_APP_MAX_PLAYERS_IN_ROOM);
export const MAX_PLAYERS_IN_ROOM =
  parsedMaxPlayers > 0 && parsedMaxPlayers <= 10 ? parsedMaxPlayers : 3;

const parsedTetrominoesAmount = Number(
  process.env.REACT_APP_TETROMINOES_AMOUNT
);
export const TETROMINOES_AMOUNT =
  parsedTetrominoesAmount >= 10 && parsedTetrominoesAmount <= 142
    ? parsedTetrominoesAmount
    : 42;

// Declare and export basic game vars:
export let roomsList = new RoomsList();
export let gameTetris = new Game();
export let playersList = new PlayersList();
export let tetromino = new Tetromino();

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

// Configure CORS allowed origins
const getAllowedOrigins = () => {
  const origins = [];
  
  // Add FRONTEND_URL if provided (for production like Render.com)
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }
  
  // Add localhost origins for local development
  if (process.env.REACT_APP_FRONTEND_PORT) {
    origins.push(`http://localhost:${process.env.REACT_APP_FRONTEND_PORT}`);
  }
  
  // Add host-based origin if FRONTEND_URL is not set (backward compatibility)
  if (!process.env.FRONTEND_URL && process.env.REACT_APP_HOST && process.env.REACT_APP_FRONTEND_PORT) {
    origins.push(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_FRONTEND_PORT}`);
  }
  
  return origins.length > 0 ? origins : ['http://localhost:4040'];
};

// Configure CORS middleware
app.use(
  cors({
    origin: getAllowedOrigins(),
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

server.listen(process.env.REACT_APP_BACKEND_PORT || 4444, () => {
  console.log(
    'BACKEND IS READY: server is running on port ' +
      process.env.REACT_APP_BACKEND_PORT
  );
  connectToDatabase();
});
