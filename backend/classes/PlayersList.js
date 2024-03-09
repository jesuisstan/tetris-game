class PlayersList extends Array {
  constructor() {
    super();
  }

  // Add New Player
  async addNewPlayer(newPlayer) {
    const player = this.find((p) => p.nickname === newPlayer.nickname);

    if (player && player.nickname) {
      console.log(`Player "${player.nickname}" is already in the list.`);
      return;
    } else {
      this.push(newPlayer);
    }
  }

  // Delete Player
  async erasePlayer(playerToRemove) {
    this.splice(
      this.findIndex((player) => player.socketId === playerToRemove.socketId),
      1
    );
  }

  // Update Player
  async updatePlayer(socket, data) {
    return new Promise((resolve, reject) => {
      this.filter((player) => player.nickname !== data.nickname);

      this.push({
        nickname: data.nickname,
        socketId: socket.id,
        admin: false,
        room: '',
        gameOver: false
      });

      resolve(this);
    });
  }
}

export default PlayersList;
