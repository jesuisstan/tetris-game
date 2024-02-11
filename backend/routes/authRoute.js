import express from "express";
import Player from "../classes/Player.js";

const router = express.Router();

//CREATE A USER
router.post("/signup", Player.signup)

//SIGN IN
router.post("/signin", Player.signin)

//LOGOUT
router.get("/logout", Player.logout);

export default router;
