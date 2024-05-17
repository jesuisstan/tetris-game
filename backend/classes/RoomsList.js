class RoomsList extends Array {
  constructor() {
    super();
  }

  // Method to add a new room to the list
  addRoom(room) {
    this.push(room);
  }

  // Method to remove a room from the list
  removeRoom(roomName) {
    this.splice(
      this.findIndex((room) => room.name === roomName),
      1
    );
  }

  // Method to get a room data from the list by it's name
  getRoomByName(roomName) {
    return this.find((room) => room.name === roomName);
  }

  updateRooms(newRoomsList) {
    // Clear the current list
    this.length = 0;
    // Add each room from the new list
    newRoomsList.forEach((room) => this.addRoom(room));
  }

  getRooms(io) {
    const roomsOnSocket = io.sockets.adapter.rooms;
    const filteredRooms = new RoomsList();

    this.forEach((room) => {
      if (roomsOnSocket.has(room.name)) {
        filteredRooms.addRoom(room);
      }
    });

    return filteredRooms;
  }

  sendRoomsList(io) {
    const roomsList = this.getRooms(io);
    this.updateRooms(roomsList);
    io.emit('update_rooms', { roomsList });
  }

  // Method to get rooms associated with a given socket ID
  getRoomsNamesForSocket(io, socketId) {
    const roomsOnSocket = io.sockets.adapter.rooms;
    const rooms = [];

    for (const [roomName, sockets] of roomsOnSocket.entries()) {
      if (sockets.has(socketId)) {
        rooms.push(roomName);
      }
    }

    return rooms;
  }

  // Method to check the presence of a room and emit the result
  checkRoomPresence(io, socketId, roomName) {
    const roomExists = this.some((room) => room.name === roomName);
    io.to(socketId).emit('room_exists', { roomName, presence: roomExists });
  }
}

export default RoomsList;
