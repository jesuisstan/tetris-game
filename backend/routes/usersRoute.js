import express from 'express';
//import { getUserData } from '../controllers/user.js';
import Player from "../classes/Player.js";

import { verifyToken } from '../utils.js';

const router = express.Router();

//get a user
router.get('/getuser', verifyToken, Player.getUserData);

export default router;
