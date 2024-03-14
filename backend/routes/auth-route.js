import express from "express";
import { signin, signup, logout } from "../controllers/auth.js";

const router = express.Router();

//CREATE A USER
router.post("/signup", signup)

//SIGN IN
router.post("/signin", signin)

//LOGOUT
router.get("/logout", logout);

export default router;
