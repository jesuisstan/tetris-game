import { Server } from 'socket.io';
import Player from './classes/Player.js';
import Tetromino from './classes/Tetromino.js';
import {
  MAX_PLAYERS_IN_ROOM,
  roomsList,
  gameTetris,
  playersList,
  tetromino
} from './index.js';

const manageSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [`${process.env.REACT_APP_HOST}:*`, 'localhost:*'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    },
    //path: '/socket',
    // improve the stability and reliability of your WebSocket connections by fine-tuning the heartbeat mechanism:
    pingInterval: 20000, // Set the interval between ping-requests from Server to Client
    pingTimeout: 40000 // Set the time which server awaits the answer from Client
  });

  io.sockets.setMaxListeners(42);

  io.on('connection', async (socket) => {
    try {
      // Initialize an empty send buffer for each socket connection:
      socket.sendBuffer = [];
      console.log('A new client connected. Socket id:', socket.id);
    } catch (error) {
      // Catch and log any errors that might occur during initialization:
      console.error(error.message);
    }

    socket.on('disconnect', () => {
      // Clean up all event listeners specific to this socket:
      socket.removeAllListeners();

      // Adjust game objects:
      gameTetris
        .handleLeavingRoom(io, socket, playersList, roomsList)
        .then((res) => {
          if (res.status) {
            playersList.erasePlayer(res.playerOnSocket);
            console.log(
              `${res.playerOnSocket?.nickname} (socket ${res.playerOnSocket?.socketId}) disconnected`
            );
          }
        })
        .catch((error) => {
          console.error('Error handling disconnect:', error);
        });
    });

    socket.on('player_arrived', async (data) => {
      try {
        // Create a new Player instance with the received data
        const newPlayer = new Player(data.nickname, socket.id);
        playersList.addNewPlayer(newPlayer);
      } catch (error) {
        console.error('Error creating new player:', error);
      }
    });

    socket.on('get_rooms_list', () => {
      roomsList.sendRoomsList(io);
    });

    socket.on('create_room', async (data) => {
      const existingRoom = roomsList
        .getRooms(io)
        .find((rm) => rm.name === data.room);

      if (existingRoom === undefined) {
        roomsList.addRoom({
          name: data.room,
          mode: data.gameMode,
          maxPlayers: data.gameMode === 'solo' ? 1 : MAX_PLAYERS_IN_ROOM,
          players: 1,
          state: false,
          admin: {
            socketId: socket.id,
            nickname: data.nickname
          }
        });

        gameTetris.handleCreatingRoom(io, socket, playersList, data.room);
        roomsList.sendRoomsList(io);
      } else {
        io.to(socket.id).emit('room_already_exists');
      }
    });

    //setInterval(() => {console.log(roomsList)}, 5000) // todo delete

    socket.on('join_room', async (data) => {
      try {
        await gameTetris.handleJoiningRoom(
          io,
          socket,
          data.roomName,
          playersList,
          roomsList
        );
      } catch (error) {
        console.error('Error joining room:', error);
      }
    });

    socket.on('leave_room', () => {
      gameTetris
        .handleLeavingRoom(io, socket, playersList, roomsList)
        .catch((error) => {
          console.error('Error handling "leave room" event:', error);
        });
    });

    socket.on('start_game', async (data) => {
      try {
        const room = roomsList.find((room) => room.name === data.roomName);
        const tetrominoes = await tetromino.getTetrominoes();
        await gameTetris.startGame(
          io,
          room,
          tetrominoes,
          data.roomName,
          socket.id
        );
        roomsList.sendRoomsList(io);
      } catch (error) {
        console.error('Error handling start game:', error);
      }
    });

    socket.on('get_tetrominoes', async (data) => {
      const tetrominoes = await tetromino.getTetrominoes();
      gameTetris.newTetrominoes(io, data.roomName, tetrominoes);
    });

    socket.on('board_from_front', (data) => {
      const player = playersList.find((p) => p.socketId === socket.id);
      if (player && player.room === data.roomName)
        gameTetris.sendBoard(
          io,
          socket.id,
          data.roomName,
          data.board,
          data.nickname
        );
    });

    socket.on('check_room_presence', async (data) => {
      roomsList.checkRoomPresence(io, socket.id, data.roomName);
    });

    socket.on('game_over', async (data) => {
      try {
        await gameTetris.handleGameOver(
          io,
          socket.id,
          data,
          playersList,
          roomsList
        );
      } catch (error) {
        console.error('Error handling "game_over" event:', error);
      }
    });

    socket.on('penalty_condition', async (data) => {
      gameTetris.addPenalty(io, socket.id, data?.roomName, data?.penaltyRows);
    });
  });

  return io;
};

export default manageSocket;
