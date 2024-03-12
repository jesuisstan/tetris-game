import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userexists: null,
  socket: null,
  userName: '',
  roomname: '',
  roomData: [],
  connected: false,
  tetriminos: [],
  rooms: [],
  roomPlayers: [],
  chat: [],
  Stages: [],
  GameOver: false,
  GameFinished: false,
  penalty: false
};

const socketsSlice = createSlice({
  name: 'sockets',
  initialState: initialState,
  reducers: {
    socketConnect(state, action) {
      state.connected = true;
      state.socket = action.payload.socket;
    },
    socketDisconnect(state) {
      state.connected = false;
      state.socket = null;
    },
    newTetriminos(state, action) {
      state.tetriminos = action.payload.tetriminos;
    },
    userExists(state, action) {
      state.userexists = action.payload.userexists;
    },
    newPlayer(state, action) {
      state.userName = action.payload.userName;
    },
    newRoom(state, action) {
      state.roomname = action.payload.roomname;
    },
    updateRoomData(state, action) {
      state.roomData = action.payload.room;
    },
    startGame(state, action) {
      state.GameOver = false;
      state.GameFinished = false;
      state.tetriminos = action.payload.tetriminos;
    },
    gameOver(state) {
      state.GameOver = true;
    },
    setRooms(state, action) {
      state.rooms = action.payload.rooms;
    },
    addStages(state, action) {
      state.Stages = action.payload.Stages;
    },
    updateStages(state, action) {
      state.Stages = action.payload.Stages;
    },
    roomPlayersList(state, action) {
      state.roomPlayers = action.payload.roomPlayers;
    },
    chatMessages(state, action) {
      state.chat = [...state.chat, action.payload.messages];
    },
    clearChatMessages(state) {
      state.chat = [];
      state.roomData = [];
    },
    clearAllState(state) {
      state.userName = '';
      state.tetriminos = [];
      state.rooms = [];
      state.roomPlayers = [];
      state.chat = [];
      state.Stages = [];
      state.penalty = false;
    },
    gameFinished(state) {
      state.GameFinished = true;
      state.penalty = false;
      state.tetriminos = [];
      state.roomPlayers = [];
    },
    clearStateLeavedRoom(state) {
      state.roomPlayers = [];
      state.chat = [];
      state.Stages = [];
      state.tetriminos = [];
      state.GameFinished = false;
      state.roomname = '';
    },
    addPenalty(state, action) {
      state.penalty = action.payload.penalty;
    }
  }
});

export const {
  socketConnect,
  socketDisconnect,
  newTetriminos,
  userExists,
  newPlayer,
  newRoom,
  updateRoomData,
  startGame,
  gameOver,
  setRooms,
  addStages,
  updateStages,
  roomPlayersList,
  chatMessages,
  clearChatMessages,
  clearAllState,
  gameFinished,
  clearStateLeavedRoom,
  addPenalty
} = socketsSlice.actions;

export default socketsSlice.reducer;
