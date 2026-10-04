import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./configs/db.js";
import authRouter from "./Routes/authRouter.js";
import logRouter from "./Routes/logsRouter.js";
import reportRouter from "./Routes/reportRouts.js";
import insightRouter from "./Routes/insightRouter.js";
import ragRouter from "./Routes/ragRouter.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());
app.get("/api/test", (req, res) => {
  console.log("backend running");
  res.status(200).json({ message: "Backend is running " });
});
app.use("/api", authRouter);
app.use("/api", logRouter);
app.use("/api/report", reportRouter);
app.use("/api/rag", ragRouter);

app.post("/webhook/vapi", async (req, res) => {
  console.log("Received webhook:", req.body);
  res.sendStatus(200);
});
app.use("/api", insightRouter);
try {
  await db.query("SELECT 1");
  console.log("Connected to the database ");
} catch (err) {
  console.error("Database connection failed ", err);
}
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
