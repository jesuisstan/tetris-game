import User from '../models/User.js';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../error.js';

class Player extends User {
  constructor(userData) {
    super(userData);
  }

  static async signup(req, res, next) {
    try {
      const existingUserByEmail = await User.findOne({ email: req.body.email });
      const existingUserByNickname = await User.findOne({
        nickname: req.body.nickname
      });

      if (existingUserByEmail) {
        return next(createError(409, 'Email already exists in database!'));
      }

      if (existingUserByNickname) {
        return next(createError(451, 'Nickname already exists in database!'));
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      const newUser = new Player({ ...req.body, password: hash });

      await newUser.save();
      res.status(200).send('User has been created!');
    } catch (err) {
      console.log('server error: ', err);
      next(err);
    }
  }

  static async signin(req, res, next) {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) return next(createError(451, 'User not found!'));

      const isCorrect = await bcrypt.compare(req.body.password, user.password);

      if (!isCorrect) return next(createError(409, 'Wrong password!'));

      const token = jwt.sign({ id: user._id }, process.env.JWT);
      const { password, ...others } = user._doc;

      res
        .cookie('access_token', token, {
          httpOnly: true
        })
        .status(200)
        .json(others);
    } catch (err) {
      next(err);
    }
  }

  static logout(req, res, next) {
    try {
      // Clear the "access_token" cookie by setting it to an empty string and setting its expiration in the past.
      res.clearCookie('access_token', {
        httpOnly: true,
        expires: new Date(0) // This sets the expiration to a date in the past, effectively deleting the cookie.
      });
      res.status(200).send('Logged out successfully!');
    } catch (err) {
      next(err);
    }
  }

  static getUserData = async (req, res, next) => {
    try {
      const userId = req.userId;

      // Fetch the user data from the database using the user ID
      const user = await User.findById(userId).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };
}

export default Player;
