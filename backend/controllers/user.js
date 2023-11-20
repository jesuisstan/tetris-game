import { createError } from "../error.js";
import User from "../models/User.js";

export const getUserData = async (req, res, next) => {
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