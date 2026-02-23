import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
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

// Load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

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

// Get allowed origins array
const allowedOrigins = getAllowedOrigins();

// Configure CORS middleware with function for dynamic origin checking
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
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

// Keep-alive ping to prevent Render.com from sleeping
const ping = async (url) => {
  try {
    await fetch(url);
    console.log(`Ping success: ${url}`);
  } catch (error) {
    console.error(`Ping failed: ${url}`, error);
  }
};

// Start keep-alive pings every 5 minutes
const startKeepAlive = () => {
  const frontendUrl = process.env.FRONTEND_URL;
  const backendUrl = process.env.REACT_APP_BACKEND_URL 
    ? `${process.env.REACT_APP_BACKEND_URL}/api/check`
    : `http://localhost:${process.env.REACT_APP_BACKEND_PORT || 4444}/api/check`;

  if (frontendUrl || process.env.NODE_ENV === 'production') {
    setInterval(() => {
      if (frontendUrl) {
        ping(frontendUrl);
      }
      ping(backendUrl);
    }, 5 * 60 * 1000); // every 5 minutes
    
    console.log('Keep-alive ping started (every 5 minutes)');
    if (frontendUrl) {
      console.log(`Frontend URL: ${frontendUrl}`);
    }
    console.log(`Backend URL: ${backendUrl}`);
  }
};

startKeepAlive();