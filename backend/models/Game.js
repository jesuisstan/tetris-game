import { MAX_PLAYERS_IN_ROOM } from '../index.js';

class Game {
  constructor() {}

  // Send a list of a room players to a client:
  sendRoomPlayersList = (io, room, playersList) => {
    return new Promise((resolve, reject) => {
      const socketIds = [];
      const roomPlayersList = [];
      const clientsList = io.sockets.adapter.rooms.get(room);

      if (clientsList) {
        for (const clientId of clientsList) {
          socketIds.push(clientId);
        }

        for (let i = 0; i < playersList.length; i++) {
          for (let j = 0; j < socketIds.length; j++) {
            if (playersList[i].socketId === socketIds[j]) {
              roomPlayersList.push(playersList[i].nickname);
            }
          }
        }
      }
      console.log('roomPlayersList', roomPlayersList); // todo delete
      io.to(room).emit('room_players', roomPlayersList); // todo was "roomPlayers"
    });
  };

  // Get an array of player objects:
  getRoomPlayersDetails = (io, room, playersList) => {
    return new Promise((resolve, reject) => {
      const socketIds = [];
      const roomPlayersList = [];
      const clientsList = io.sockets.adapter.rooms.get(room);

      if (clientsList) {
        for (const clientId of clientsList) {
          socketIds.push(clientId);
        }
        for (let i = 0; i < playersList.length; i++) {
          for (let j = 0; j < socketIds.length; j++) {
            if (playersList[i].socketId === socketIds[j]) {
              roomPlayersList.push(playersList[i]);
            }
          }
        }
      }

      resolve(roomPlayersList);
    });
  };

  // Get an array of player names:
  getRoomPlayersNicknames = (io, room, playersList) => {
    return new Promise((resolve, reject) => {
      const socketIds = [];
      const roomPlayersList = [];
      const clientsList = io.sockets.adapter.rooms.get(room);

      if (clientsList) {
        for (const clientId of clientsList) {
          socketIds.push(clientId);
        }
        for (let i = 0; i < playersList.length; i++) {
          for (let j = 0; j < socketIds.length; j++) {
            if (playersList[i].socketId === socketIds[j]) {
              roomPlayersList.push(playersList[i].nickname);
            }
          }
        }
      }

      resolve(roomPlayersList);
    });
  };

  // Get a room's admin:
  getRoomAdmin = (io, socketId, room, playersList) => {
    return new Promise((resolve, reject) => {
      const socketIds = [];
      const clientsList = io.sockets.adapter.rooms.get(room?.name);
      let admin;

      if (clientsList) {
        for (const clientId of clientsList) {
          socketIds.push(clientId);
        }
        for (let i = 0; i < socketIds.length; i++) {
          if (socketIds[i] === socketId)
            admin = playersList.find((p) => p.socketId === socketId);
        }

        resolve(admin);
      }
    });
  };

  sendMessage = (io, data) => {
    return new Promise((resolve, reject) => {
      io.to(data.room).emit('chat', {
        name: data.name,
        message: data.message,
        type: data.type
      });
      resolve(true);
    });
  };

  /*
   **  Tells the room that a player has joined
   */
  joinedRoomMessage = (io, room, name, message) => {
    return new Promise((resolve, reject) => {
      const data = { name: name, message: message, type: 'joined' };
      this.sendMessage(io, { name: name, message: message, type: 'joined' });
      // io.to(room).emit('playersJoined', message);
    });
  };

  // Send roomsList to client:
  sendRoomsList = (io, roomsList) => {
    return new Promise((resolve, reject) => {
      io.emit('update_rooms', roomsList);
      resolve(true);
    });
  };

  // Create a new room:
  handleCreatingRoom = (io, socket, playersList, room) => {
    return new Promise(async (resolve, reject) => {
      const players = playersList.filter((p) => p.socketId === socket.id);

      players[0]?.setAdminStatus(true);
      players[0]?.setRoom(room);

      socket.join(room);

      if (
        players[0]?.nickname &&
        io.to(room).emit('chat', {
          // todo Chat ?
          message: `${players[0]?.nickname} joined the room "${room}"`,
          type: 'joined'
        })
      ) {
        this.sendRoomPlayersList(io, room, playersList);
      }
    });
  };

  // Join a room:
  handleJoiningRoom = (io, socket, room, playersList, roomsList) => {
    return new Promise((resolve, reject) => {
      const roomData = roomsList.find((rm) => rm.name === room);
      console.log('-----------------room---------------', room);

      this.getRoomPlayersNicknames(io, room, playersList).then((users) => {
        if (users.length < MAX_PLAYERS_IN_ROOM) {
          const players = playersList.filter((p) => p.socketId === socket.id);

          players[0].setRoom(roomData.name);
          socket.join(roomData.name);

          this.sendRoomPlayersList(io, roomData.name, playersList);

          io.to(roomData.name).emit('chat', {
            // todo Chat ?
            message: `${players[0]?.nickname} joined the room "${roomData.name}"`,
            type: 'joined'
          });

          roomData.players += 1;

          io.emit('update_rooms', roomsList);
          io.to(room).emit('update_room_data', roomData);
        } else {
          io.to(socket.id).emit('room_full');
        }
      });
    });
  };

  // Notify a room that a player has left, change admin of a room:
  handleLeavingRoom = (io, socket, playersList, roomsList) => {
    console.log('ROOMS at handleLeavingRoom 1', roomsList); // todo delete
    return new Promise((resolve, reject) => {
      const playerToErase = playersList.find((p) => p.socketId === socket.id);
      const roomToLeave = playerToErase?.room;
      const isAdmin = playerToErase?.admin;

      if (roomToLeave) {
        socket.leave(roomToLeave);
        io.to(playerToErase.socketId).emit('left_room'); // todo was 'leaved_room';
        io.to(roomToLeave).emit('chat', {
          // todo Chat ?
          message: `${playerToErase.nickname} Left the room`,
          type: 'left'
        });
        io.to(roomToLeave).emit('clearStages', {
          nickname: playerToErase.nickname
        });

        const playersOnSocket = playersList.filter(
          (p) => p.socketId === socket.id
        );
        const roomData = roomsList.find((rm) => rm.name === roomToLeave);

        playersOnSocket[0].setAdminStatus(false);
        playersOnSocket[0].setRoom('');
        playersOnSocket[0].setGameOver(false);

        const playersInRoom = playersList.filter((p) => p.room === roomToLeave);

        if (!isAdmin && playersInRoom.length >= 1 && roomData?.state) {
          roomData.players -= 1;

          if (playersInRoom.length === 1) {
            const playerWinner = playersList.find(
              (p) => p.room === roomData.name && !p.gameOver
            );
            io.to(playerWinner.socketId).emit('game_over', {
              // todo was 'Game_finish';
              winner: playerWinner
            });
            io.to(roomData.name).emit('chat', {
              message: `${playerWinner?.nickname} wins the game!`,
              type: 'admin'
            });

            roomData.state = false;
          }

          io.emit('update_rooms', roomsList);
          io.to(roomToLeave).emit('update_room_data', roomData);
        } else if (isAdmin && playersInRoom.length >= 1 && roomData?.state) {
          roomData.players -= 1;

          playersInRoom[0].setAdminStatus(true);

          if (playersInRoom.length === 1) {
            const playerWinner = playersList.find(
              (p) => p.room === roomData.name && !p.gameOver
            );
            io.to(playerWinner.socketId).emit('game_over', {
              // todo was 'Game_finish';
              winner: playerWinner
            });
            io.to(roomData.name).emit('chat', {
              // todo Chat ?
              message: `${playerWinner?.nickname} wins the game!`,
              type: 'admin'
            });
            roomData.state = false;
          }

          io.to(roomToLeave).emit('update_room_data', roomData);
          io.emit('update_rooms', roomsList);
          io.to(roomToLeave).emit('chat', {
            // todo Chat ?
            message: `${playersInRoom[0].nickname} gets admin status.`,
            type: 'admin'
          });

          resolve({ status: true, playerToErase, roomsList });
        } else if (!isAdmin && playersInRoom.length >= 1 && !roomData.state) {
          roomData.players -= 1;
          io.emit('update_rooms', roomsList);
          io.to(roomToLeave).emit('update_room_data', roomData);
        } else if (isAdmin && playersInRoom.length >= 1 && !roomData.state) {
          playersInRoom[0].setAdminStatus(true);
          roomData.players -= 1;

          io.to(roomToLeave).emit('update_room_data', roomData);
          io.emit('update_rooms', roomsList);
          io.to(roomToLeave).emit('chat', {
            message: `${playersInRoom[0].nickname} gets admin status.`,
            type: 'admin'
          });
          resolve({ status: true, playerToErase, roomsList });
        } else {
          const newRoomsList = roomsList.filter(
            (rm) => rm.name !== roomToLeave
          );

          console.log('NEWWWWWWWW ROOMS at handleLeavingRoom', newRoomsList); // todo delete

          socket.emit('update_roomList', newRoomsList);
          roomsList.updateRooms(newRoomsList);
          io.emit('update_rooms', roomsList);
          io.to(roomToLeave).emit('update_room_data', []);
          resolve({ status: true, playerToErase, roomsList });
        }
      } else {
        resolve({ status: true, playerToErase, roomsList });
      }
    });
  };

  startGame = (io, room, Tetrimios) => {
    return new Promise((resolve, reject) => {
      if (!room.state) {
        room.state = true;
        io.to(room.name).emit('startGame', Tetrimios);
      }
    });
  };

  newTetriminos = (io, room, Tetrimios) => {
    return new Promise((resolve, reject) => {
      io.to(room).emit('newTetriminos', Tetrimios);
    });
  };

  sendStage = (io, room, stage, username) => {
    return new Promise((resolve, reject) => {
      io.to(room).emit('getstages', { stage, username });
    });
  };

  /*
   ** Check Stages state and send it to the rooms
   */
  checkStages = (io, Stages, stage, room) => {
    return new Promise((resolve, reject) => {
      io.to(room).emit('updateStages', { Stages });
    });
  };

  toggleGameMode = (io, data, roomsList) => {
    return new Promise((resolve, reject) => {
      const room = roomsList.filter((room) => room.name === data.roomName);

      if (room[0].players === 1) {
        room[0].mode = data.mode;
        if (data.mode === 'competition')
          room[0].maxPlayers = MAX_PLAYERS_IN_ROOM;
        else room[0].maxPlayers = 1;
      }

      io.to(data.roomName).emit('update_room_data', room[0]);
      io.emit('update_rooms', roomsList);
    });
  };

  handleGameOver = (io, data, playersList, roomsList) => {
    return new Promise((resolve, reject) => {
      const room = roomsList.find((room) => room?.name === data?.room);
      const player = playersList.find(
        (player) => player?.nickname === data?.nickname
      );

      if (room?.players === 1) {
        room.state = false;
        io.emit('update_rooms', roomsList);
      }
      if (
        room?.mode === 'competition' &&
        player?.room === room?.name &&
        !player.gameOver
      ) {
        player.gameOver = true;
        io.to(room.name).emit('chat', {
          message: `${player?.nickname} lose`,
          type: 'joined'
        });

        this.getRoomPlayersDetails(io, room.name, playersList).then((res) => {
          const losers = playersList.filter(
            (p) => p.room === room.name && p.gameOver
          );

          if (res.length === losers.length) {
            room.state = false;
            losers.forEach((element) => {
              element.gameOver = false;
            });
            io.emit('update_rooms', roomsList);
          }
          if (
            res.length <= MAX_PLAYERS_IN_ROOM &&
            res.length >= 2 &&
            res.length - 1 === losers.length
          ) {
            const playerWinner = playersList.find(
              (p) => p.room === room.name && !p.gameOver
            );

            io.to(playerWinner.socketId).emit('game_over', {
              // todo was 'Game_finish';
              winner: playerWinner
            });
            io.to(room.name).emit('chat', {
              message: `${playerWinner?.nickname} wins the game!`,
              type: 'admin'
            });

            room.state = false;
            io.emit('update_rooms', roomsList);
            losers.forEach((element) => {
              element.gameOver = false;
            });
          }
        });
      }
    });
  };

  // As soon as a player destroys n lines on his ground, the opposit player receive n - 1 lines in penalty:
  addPenalty = (socket, room) => {
    return new Promise((resolve, reject) => {
      socket.broadcast.to(room).emit('addPenalty');
    });
  };
}

export default Game;
