import express from 'express';
import { update, deleteUser, getUserData } from '../controllers/user.js';
import { verifyToken } from '../verifyToken.js';

const router = express.Router();

//update user
router.put('/:id', verifyToken, update);

//delete user
router.delete('/:id', verifyToken, deleteUser);

//get a user
router.get('/getuser', verifyToken, getUserData);

export default router;
