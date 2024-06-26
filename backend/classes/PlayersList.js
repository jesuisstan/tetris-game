class PlayersList extends Array {
  constructor() {
    super();
  }

  /* Method to add a new player to the list if the player's nickname and socketId combination doesn't already exist in the list. 
      If a player with the same nickname and socketId already exists, log a message stating that the player is already in the list.
      If not, add the new player to the list. */
  async addNewPlayer(newPlayer) {
    const existingPlayer = this.find(
      (p) =>
        p.nickname === newPlayer.nickname && p.socketId === newPlayer.socketId
    );

    if (existingPlayer) {
      console.warn(
        `Player "${existingPlayer.nickname}" with socketId "${existingPlayer.socketId}" is already in the list.`
      );
    } else {
      this.push(newPlayer);
    }
  }

  // Method to erase a player from the list:
  async erasePlayer(playerToErase) {
    const index = this.findIndex(
      (player) => player.socketId === playerToErase?.socketId
    );
    if (index !== -1) {
      this.splice(index, 1);
    } else {
      console.error('Player to erase is not found or undefined.');
    }
  }

  // Method to updates or add a player depending on whether a player with the given username already exists:
  async updatePlayers(socket, data) {
    return new Promise((resolve, reject) => {
      // Filter out existing player
      const filteredPlayers = this.filter(
        (player) => player.nickname !== data.nickname
      );

      // Push updated player
      filteredPlayers.push({
        nickname: data.nickname,
        socketId: socket.id,
        admin: false,
        room: '',
        gameOver: false
      });

      // Assign filteredPlayers array back to this
      this.length = 0;
      this.push(...filteredPlayers);

      resolve(this);
    });
  }
}

export default PlayersList;
