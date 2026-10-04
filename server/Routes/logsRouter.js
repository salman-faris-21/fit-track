import express from "express";
import { getTodayLogs } from "../controllers/todaylogs.js";
import { addLog } from "../controllers/logcontroller.js";
import protect from "../middleware/protect.js";
import { getWeeklyLogs } from "../controllers/weeklyLogs.js";

const logRouter = express.Router();

logRouter.get("/logs/today", protect, getTodayLogs);
logRouter.post("/logs", protect, addLog);
logRouter.get("/logs/week", protect, getWeeklyLogs);

export default logRouter;
