import { Server } from 'socket.io';
import Player from './models/Player.js';
import {
  MAX_PLAYERS_IN_ROOM,
  roomsList,
  gameTetris,
  playersList
} from './index.js';

const manageSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_FRONTEND_PORT}`,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    },
    //path: '/socket',
    // improve the stability and reliability of your WebSocket connections by fine-tuning the heartbeat mechanism:
    pingTimeout: 4000, // Set the ping timeout to 4 seconds
    pingInterval: 2000 // Set the ping interval to 2 seconds
  });

  io.on('connection', async (socket) => {
    try {
      // Initialize an empty send buffer for each socket connection:
      socket.sendBuffer = [];
      console.log(
        'A new client connected. Socket id:',
        socket.id,
        'Players list:',
        playersList
      );
    } catch (error) {
      // Catch and log any errors that might occur during initialization:
      console.error(error.message);
    }

    // Handle 'player_arrived' event
    socket.on('player_arrived', async (nickname) => {
      try {
        // Create a new Player instance with the received data
        const newPlayer = new Player(nickname, socket.id);
        playersList.addNewPlayer(newPlayer);

        // Emit a welcome message to the client
        socket.emit('welcome', {
          message: `Welcome, ${newPlayer.nickname}!`
        });
      } catch (error) {
        console.error('Error creating new player:', error);
        socket.emit('welcome_error');
      }
    });

    // Handle 'disconnect' event
    socket.on('disconnect', () => {
      gameTetris
        .handleLeavingRoom(io, socket, playersList, roomsList)
        .then((res) => {
          if (res.status) {
            playersList.erasePlayer(res.playerToErase);
            console.log(
              `${res.playerToErase?.nickname} (socket ${res.playerToErase?.socketId}) disconnected`
            );
          }
        });
    });

    // Listener for 'get_rooms_list' event:
    socket.on('get_rooms_list', () => {
      io.emit('update_rooms', { roomsList });
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
          const rm = roomsList.find((room) => room.name === data.room);
          if (rm === undefined) {
            roomsList.addRoom({
              name: data.room,
              mode: 'solo',
              maxPlayers: 1,
              players: 1,
              state: false,
              owner: socket.id
            });
            gameTetris.handleCreatingRoom(io, socket, playersList, data.room);
            io.emit('update_rooms', { roomsList });
          } else if (
            rm.mode === 'competition' &&
            rm.state === false &&
            rm.players < MAX_PLAYERS_IN_ROOM
          ) {
            gameTetris.handleJoiningRoom(
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
      const existingRoom = roomsList.find((rm) => rm.name === data.room);
      if (existingRoom === undefined) {
        roomsList.addRoom({
          name: data.room,
          mode: data.gameMode,
          maxPlayers: data.gameMode === 'solo' ? 1 : MAX_PLAYERS_IN_ROOM,
          players: 1,
          state: false,
          owner: socket.id
        });

        gameTetris.handleCreatingRoom(io, socket, playersList, data.room);
        io.emit('update_rooms', { roomsList });
      } else {
        io.to(socket.id).emit('room_already_exists');
      }
    });

    socket.on('join_room', (data) => {
      gameTetris.handleJoiningRoom(
        io,
        socket,
        data.roomName,
        playersList,
        roomsList
      );
      io.emit('room_joined', data);
    });

    socket.on('leave_room', () => {
      // todo was 'leaveRoom'
      gameTetris
        .handleLeavingRoom(io, socket, playersList, roomsList)
        .then((res) => {
          if (res.status) {
            roomsList.updateRooms(res.roomsList);
          }
        });
    });

    socket.on('startgame', async (data) => {
      const room = roomsList.find((room) => room.name === data.room);
      gameTetris
        .getRoomAdmin(io, socket.id, room, playersList)
        .then(async (user) => {
          if (user.admin) {
            const tetriminos = await Tetromino.getTetriminos();
            gameTetris.startGame(io, room, tetriminos);
            io.emit('update_rooms', roomsList);
          } else {
            io.to(socket.id).emit('wait_admin');
          }
        });
      io.emit('game_started');
    });

    socket.on('newTetriminos', async (data) => {
      const tetriminos = await Tetromino.getTetriminos();
      gameTetris.newTetriminos(io, data.room, tetriminos);
    });

    socket.on('Stage', (data) => {
      const player = playersList.find((p) => p.nickname === data.nickname);
      if (player && player.room === data.roomName)
        gameTetris.sendStage(io, data.roomName, data.stage, data.nickname);
    });

    socket.on('checkStages', async (data) => {
      gameTetris.checkStages(io, data.Stages, data.stage, data.room);
    });

    socket.on('toggle_game_mode', async (data) => {
      // todo was "updateroomMode"
      gameTetris.toggleGameMode(io, data, roomsList);
    });

    socket.on('game_over', async (data) => {
      // todo was "Game_over"
      gameTetris.handleGameOver(io, data, playersList, roomsList);
    });

    socket.on('add_penalty', async (data) => {
      gameTetris.addPenalty(socket, data.room);
    });
  });

  return io;
};

export default manageSocket;
