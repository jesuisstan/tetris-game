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
}

export default RoomsList;
