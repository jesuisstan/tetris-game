class Player {
  constructor(nickname, socketId) {
    this.nickname = nickname ?? '';
    this.socketId = socketId ?? '';
    this.admin = false;
    this.room = '';
    this.gameOver = false;
  }

  setAdminStatus = async (status) => {
    this.admin = status;
  };

  setRoom = async (roomName) => {
    this.room = roomName;
  };

  setGameOver = async (status) => {
    this.gameOver = status;
  };

  setSocketId = async (newSocketId) => {
    this.socketId = newSocketId;
  };
}

export default Player;
