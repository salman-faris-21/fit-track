import express from "express";
import userCreate from "../middleware/userCreate.js";
import login from "../middleware/login.js";
import protect from "../middleware/protect.js";

const authRouter = express.Router();

authRouter.post("/signup", userCreate);
authRouter.post("/login", login);
authRouter.get("/", protect);
export default authRouter;
