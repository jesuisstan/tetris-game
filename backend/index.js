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

server.listen(process.env.SERVER_PORT, () => {
  console.log('Server is running on port ' + process.env.SERVER_PORT);
  connect();
});
