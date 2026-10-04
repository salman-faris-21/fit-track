import express from "express";
import { getInsights } from "../controllers/getInsight.js";

const insightRouter = express.Router();

insightRouter.get("/insights", getInsights);

export default insightRouter;
