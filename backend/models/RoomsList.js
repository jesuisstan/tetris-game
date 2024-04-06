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

  // Method to update rooms in the list based on the provided roomsList
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
    console.log('SOCKET ROOMS: ', io.sockets.adapter.rooms) // todo delete
    console.log('roomsList!!!!!!!!!!!!', roomsList); // todo delete
    //return new Promise((resolve, reject) => {
    io.emit('update_rooms', { roomsList });
    //  resolve(true);
    //});
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
}

export default RoomsList;
