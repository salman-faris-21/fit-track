import express from "express";
import { generateReport } from "../controllers/reportController.js";
import protect from "../middleware/protect.js";
import { getReports } from "../controllers/getReports.js";

const reportRouter = express.Router();

reportRouter.post("/generate", protect, generateReport);
reportRouter.get("/get", protect, getReports);

export default reportRouter;
