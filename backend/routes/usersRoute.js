import express from 'express';
import { getUserData } from '../controllers/user.js';
import { verifyToken } from '../verifyToken.js';

const router = express.Router();

//get a user
router.get('/getuser', verifyToken, getUserData);

export default router;
