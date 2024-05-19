import { MAX_PLAYERS_IN_ROOM, playersList } from '../index.js';

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
      io.to(room).emit('room_players', roomPlayersList); // todo
    });
  };

  // Get an array of player objects:
  getRoomPlayersDetails = (io, roomName, playersList) => {
    return new Promise((resolve, reject) => {
      const socketIds = [];
      const roomPlayersList = [];
      const clientsList = io.sockets.adapter.rooms.get(roomName);

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
  getRoomPlayersNicknames = (io, roomName, playersList) => {
    return new Promise((resolve, reject) => {
      const socketIds = [];
      const roomPlayersList = [];
      const clientsList = io.sockets.adapter.rooms.get(roomName);

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

  sendMessageToRoom = (io, data) => {
    return new Promise((resolve, reject) => {
      try {
        io.to(data.room).emit('chat', {
          nickname: data.nickname ?? '',
          message: data.message ?? '',
          type: data.type ?? ''
        });
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Create a new room:
  handleCreatingRoom = async (io, socket, playersList, roomName) => {
    try {
      const players = playersList.filter((p) => p.socketId === socket.id);
      players[0]?.setAdminStatus(true);
      players[0]?.setRoom(roomName);

      socket.join(roomName);

      const messageData = {
        room: roomName,
        nickname: players[0]?.nickname,
        message: `joined the room "${roomName}". ✅`,
        type: 'admin'
      };

      await this.sendMessageToRoom(io, messageData);
      this.sendRoomPlayersList(io, roomName, playersList);
      return;
    } catch (error) {
      throw error;
    }
  };

  // Join a room:
  handleJoiningRoom = async (io, socket, room, playersList, roomsList) => {
    try {
      const roomData = roomsList.find((rm) => rm.name === room);
      const playerOnSocket = playersList.find((p) => p.socketId === socket.id);

      if (roomData?.state === true) {
        io.to(socket.id).emit('join_denied', {
          message: 'You cannot join a room while active game. Try later.'
        });
        return;
      } else if (roomData?.mode === 'solo') {
        socket.id === playerOnSocket?.socketId
          ? io.to(socket.id).emit('welcome_to_the_room', roomData)
          : io.to(socket.id).emit('join_denied', {
              message: 'You cannot join "solo" room.'
            });
      } else if (roomData?.mode === 'competition') {
        const roomPlayers = await this.getRoomPlayersDetails(
          io,
          room,
          playersList
        );

        if (
          roomPlayers.find(
            (player) => player.nickname === playerOnSocket.nickname
          )
        ) {
          if (
            roomPlayers.find(
              (player) => player.socketId === playerOnSocket.socketId
            )
          ) {
            io.to(socket.id).emit('welcome_to_the_room', roomData);
            return;
          } else {
            io.to(socket.id).emit('join_denied', {
              message: `${playerOnSocket.nickname} is already in the room "${room}".`
            });
            return;
          }
        }

        if (roomPlayers.length >= MAX_PLAYERS_IN_ROOM) {
          io.to(socket.id).emit('join_denied', {
            message: 'The room is full.'
          });
          return;
        }

        // Proceed with joining the room
        playerOnSocket.setRoom(roomData.name);
        playerOnSocket.setAdminStatus(false);
        socket.join(roomData.name);
        this.sendRoomPlayersList(io, roomData.name, playersList);

        const messageData = {
          room: roomData.name,
          nickname: playerOnSocket.nickname,
          message: `joined the room "${roomData.name}". ✅`,
          type: 'admin'
        };

        await this.sendMessageToRoom(io, messageData);
        roomData.players += 1;
        roomsList.sendRoomsList(io);
        io.to(room).emit('update_room_data', roomData);
        io.to(socket.id).emit('welcome_to_the_room', roomData);

        return;
      }
    } catch (error) {
      console.error('Error joining room:', error);
      io.to(socket.id).emit('join_denied', {
        message: 'Something went wrong... Refresh the page and try again.'
      });
      throw error;
    }
  };

  // Notify a room that a player has left, change admin of a room:
  handleLeavingRoom = async (io, socket, playersList, roomsList) => {
    try {
      const playerOnSocket = playersList.find((p) => p.socketId === socket.id);
      const roomToLeaveName = playerOnSocket?.room;
      const roomToLeave = roomsList.getRoomByName(roomToLeaveName);
      const isAdmin = playerOnSocket?.socketId === roomToLeave?.admin.socketId;

      if (!roomToLeave) return { status: true, playerOnSocket, roomsList };

      if (roomToLeave) {
        socket.leave(roomToLeaveName);
        roomToLeave.players -= 1;
        await this.sendMessageToRoom(io, {
          room: roomToLeaveName,
          nickname: playerOnSocket.nickname,
          message: `left the room "${roomToLeaveName}". ❌`,
          type: 'leave'
        });

        playerOnSocket.setAdminStatus(false);
        playerOnSocket.setRoom('');
        playerOnSocket.setGameOver(false);

        const playersInRoom = playersList.filter(
          (p) => p.room === roomToLeaveName && p.socketId !== socket.id
        );

        if (!isAdmin && playersInRoom.length >= 1 && roomToLeave?.state) {
          if (playersInRoom.length === 1) {
            const playerWinner = playersList.find(
              (p) => p.room === roomToLeaveName && !p.gameOver
            );
            io.to(playerWinner?.socketId).emit('game_over', {
              winner: playerWinner
            });
            await this.sendMessageToRoom(io, {
              room: roomToLeaveName,
              nickname: playerWinner?.nickname,
              message: `wins the game! 🏆`,
              type: 'winner'
            });
            roomToLeave.state = false;
            roomToLeave.admin.nickname = playerWinner?.nickname;
            roomToLeave.admin.socketId = playerWinner?.socketId;
            playerWinner?.setAdminStatus(true);
            playerWinner?.setGameOver(true);
            await this.sendMessageToRoom(io, {
              room: roomToLeaveName,
              nickname: playerWinner?.nickname,
              message: `gets admin status in "${roomToLeaveName}" room.`,
              type: 'admin'
            });
          }

          roomsList.sendRoomsList(io);
          io.to(roomToLeaveName).emit('update_room_data', roomToLeave);
        } else if (isAdmin && playersInRoom.length >= 1 && roomToLeave?.state) {
          playersInRoom[0].setAdminStatus(true);
          roomToLeave.admin.nickname = playersInRoom[0].nickname;
          roomToLeave.admin.socketId = playersInRoom[0].socketId;

          if (playersInRoom.length === 1) {
            const playerWinner = playersList.find(
              (p) => p.room === roomToLeaveName && !p.gameOver
            );
            io.to(playerWinner?.socketId).emit('set_gameover', {
              winner: playerWinner
            });
            await this.sendMessageToRoom(io, {
              room: roomToLeaveName,
              nickname: playerWinner?.nickname,
              message: `wins the game! 🏆`,
              type: 'winner'
            });
            roomToLeave.state = false;
            playersInRoom[0].setGameOver(true);
          }

          await this.sendMessageToRoom(io, {
            room: roomToLeaveName,
            nickname: playersInRoom[0]?.nickname,
            message: `gets admin status in "${roomToLeaveName}" room.`,
            type: 'admin'
          });
          roomsList.sendRoomsList(io);
          io.to(roomToLeaveName).emit('update_room_data', roomToLeave);
        } else if (
          !isAdmin &&
          playersInRoom.length >= 1 &&
          !roomToLeave.state
        ) {
          roomsList.sendRoomsList(io);
          io.to(roomToLeaveName).emit('update_room_data', roomToLeave);
        } else if (isAdmin && playersInRoom.length >= 1 && !roomToLeave.state) {
          playersInRoom[0].setAdminStatus(true);
          roomToLeave.admin.nickname = playersInRoom[0].nickname;
          roomToLeave.admin.socketId = playersInRoom[0].socketId;

          roomsList.sendRoomsList(io);
          io.to(roomToLeaveName).emit('update_room_data', roomToLeave);
          await this.sendMessageToRoom(io, {
            room: roomToLeaveName,
            nickname: playersInRoom[0]?.nickname,
            message: `gets admin status in "${roomToLeaveName}" room.`,
            type: 'admin'
          });
        } else {
          roomsList.sendRoomsList(io);
        }
        return { status: true, playerOnSocket, roomsList };
      }
    } catch (error) {
      console.error('Error handling leaving room:', error);
      return { status: false, error };
    }
  };

  startGame = async (io, room, tetrominoes, requestedRoomName, socketId) => {
    try {
      if (!room) {
        io.to(socketId).emit('game_start_error', {
          message: `Room "${requestedRoomName}" not found.`
        });
        throw new Error('Room not found');
      }

      const players = await this.getRoomPlayersDetails(
        io,
        room.name,
        playersList
      );
      players.forEach((player) => {
        player.gameOver = false;
      });

      if (!room.state) {
        room.state = true;
        io.to(room.name).emit('game_started', tetrominoes);
        io.to(room.name).emit('chat', {
          message: `The game started!`,
          type: 'status'
        });

        return;
      }
    } catch (error) {
      throw error;
    }
  };

  newTetrominoes = (io, room, tetrominoes) => {
    io.to(room).emit('new_tetrominoes', tetrominoes);
  };

  handleGameOver = async (io, socketId, data, playersList, roomsList) => {
    try {
      const room = roomsList.getRoomByName(data?.roomName);
      const player = playersList.find(
        (player) => player?.socketId === socketId
      );
      const isAdmin = socketId === room?.admin.socketId;

      if (room?.players === 1) {
        room.state = false;
        room.admin.nickname = player?.nickname;
        room.admin.socketId = player?.socketId;
        roomsList.sendRoomsList(io);

        player?.setAdminStatus(true);
        player?.setGameOver(true);
        if (player.room === data?.roomName) {
          io.to(socketId).emit('set_gameover');
        }
      } else if (
        room?.mode === 'competition' &&
        player?.room === room?.name &&
        !player.gameOver
      ) {
        player.gameOver = true;
        io.to(socketId).emit('set_gameover');

        await this.sendMessageToRoom(io, {
          room: room.name,
          nickname: player?.nickname,
          message: `lost this round. 🚩`,
          type: 'gameOver'
        });

        const roomPlayers = await this.getRoomPlayersDetails(
          io,
          room.name,
          playersList
        );
        const losers = roomPlayers.filter((p) => p.gameOver);

        if (roomPlayers.length === losers.length) {
          room.state = false;
          losers.forEach((element) => {
            element.gameOver = false;
          });
          roomsList.sendRoomsList(io);
        } else if (
          roomPlayers.length <= MAX_PLAYERS_IN_ROOM &&
          roomPlayers.length >= 2
        ) {
          if (roomPlayers.length - 1 === losers.length) {
            const playerWinner = roomPlayers.find((p) => !p.gameOver);

            io.to(playerWinner?.socketId).emit('set_gameover', {
              winner: playerWinner
            });
            await this.sendMessageToRoom(io, {
              room: room.name,
              nickname: playerWinner?.nickname,
              message: `wins the game! 🏆`,
              type: 'winner'
            });

            room.state = false;
            room.admin.nickname = playerWinner?.nickname;
            room.admin.socketId = playerWinner?.socketId;
            playerWinner.setAdminStatus(true);
            io.to(room.name).emit('update_room_data', room);
            roomsList.sendRoomsList(io);
            await this.sendMessageToRoom(io, {
              room: room.name,
              nickname: playerWinner?.nickname,
              message: `has admin status in "${room.name}" room.`,
              type: 'admin'
            });
            losers.forEach((element) => {
              element.gameOver = false;
            });
          } else if (roomPlayers.length - 1 > losers.length) {
            // case: there are at least 2 players who didn't lose
            if (isAdmin) {
              // find 1st not-admin playing player and make him be admin:
              const nonAdminActivePlayer = roomPlayers.find(
                (p) =>
                  p.gameOver === false && p.socketId !== room.admin.socketId
              );
              nonAdminActivePlayer.setAdminStatus(true);
              room.admin.nickname = nonAdminActivePlayer?.nickname;
              room.admin.socketId = nonAdminActivePlayer?.socketId;
              io.to(room.name).emit('update_room_data', room);
              roomsList.sendRoomsList(io);
              await this.sendMessageToRoom(io, {
                room: room.name,
                nickname: nonAdminActivePlayer?.nickname,
                message: `gets admin status in "${room.name}" room.`,
                type: 'admin'
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error handling game over:', error);
    }
  };

  sendBoard = (io, exceptSocketId, roomName, board, playerName) => {
    return new Promise((resolve, reject) => {
      const room = io.sockets.adapter.rooms.get(roomName);

      if (room) {
        for (const socketId of room) {
          if (socketId !== exceptSocketId) {
            io.to(socketId).emit('board_from_back', { board, playerName });
          }
        }
      }

      //// first implementation:
      //const socketIds = Array.from(
      //  io.sockets.adapter.rooms.get(roomName) || []
      //);

      //socketIds.forEach((socketId) => {
      //  if (socketId !== exceptSocketId) {
      //    io.to(socketId).emit('board_from_back', { board, playerName });
      //  }
      //});

      resolve(true);
    });
  };

  // As soon as a player destroys n lines on his ground, the opposit players receive n - 1 lines in penalty:
  addPenalty = (io, exceptSocketId, roomName, penaltyRows) => {
    return new Promise((resolve, reject) => {
      const room = io.sockets.adapter.rooms.get(roomName);

      if (room) {
        for (const socketId of room) {
          if (socketId !== exceptSocketId) {
            io.to(socketId).emit('add_penalty', { penaltyRows });
          }
        }
      }

      resolve(true);
    });
  };
}

export default Game;
