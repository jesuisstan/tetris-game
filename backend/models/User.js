import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  socketId: {
    type: String,
    default: ''
  },
  admin: {
    type: Boolean,
    default: false
  },
  room: {
    type: String,
    default: ''
  },
  gameOver: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('User', UserSchema);
