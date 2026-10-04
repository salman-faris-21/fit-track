import axios from "axios";
import FormData from "form-data";
import db from "../configs/db.js";

const PYTHON_RAG_SERVICE_URL =
  process.env.PYTHON_RAG_SERVICE_URL || "http://localhost:8000";

const AXIOS_TIMEOUT = Number(process.env.AXIOS_TIMEOUT_RAG) ?? 30000;

// Axios instance with default settings for the Python service
const pythonClient = axios.create({
  baseURL: PYTHON_RAG_SERVICE_URL,
  timeout: AXIOS_TIMEOUT,
});
console.log(pythonClient);

// Helper for formatting date to YYYY-MM-DD
const formatDate = (date) => new Date(date).toISOString().slice(0, 10);

// Builder to format MySQL database entries into readable log strings
const buildLogEntries = (sleep, water, workout, calories) => {
  const entries = [];

  sleep.forEach((item) => {
    entries.push({
      source: "sleep",
      date: formatDate(item.log_date),
      text: `Sleep log: ${item.hours} hours`,
    });
  });

  water.forEach((item) => {
    entries.push({
      source: "water",
      date: formatDate(item.log_date),
      text: `Water log: ${item.amount} ml`,
    });
  });

  workout.forEach((item) => {
    entries.push({
      source: "workout",
      date: formatDate(item.log_date),
      text: `Workout log: ${item.duration} minutes`,
    });
  });

  calories.forEach((item) => {
    entries.push({
      source: "calories",
      date: formatDate(item.log_date),
      text: `Calories log: ${item.calories} kcal`,
    });
  });

  return entries.sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Compatibility handler for log-based fitness program generation.
 * Pulls MySQL data, sends it to Python for processing/completions.
 */
export const generateProgram = async (req, res) => {
  try {
    const userId = req.user.id;
    const prompt =
      req.body.prompt ||
      "Create a personalized 7-day fitness program using the user's recent workout, sleep, water, and calorie logs.";

    // Fetch user fitness data from MySQL
    const [sleep] = await db.query(
      `SELECT log_date, hours FROM sleep_logs WHERE user_id = ? ORDER BY log_date DESC LIMIT 30`,
      [userId],
    );
    const [water] = await db.query(
      `SELECT log_date, amount FROM water_logs WHERE user_id = ? ORDER BY log_date DESC LIMIT 30`,
      [userId],
    );
    const [workout] = await db.query(
      `SELECT log_date, duration FROM workout_logs WHERE user_id = ? ORDER BY log_date DESC LIMIT 30`,
      [userId],
    );
    const [calories] = await db.query(
      `SELECT log_date, calories FROM calorie_logs WHERE user_id = ? ORDER BY log_date DESC LIMIT 30`,
      [userId],
    );

    const userLogs = buildLogEntries(sleep, water, workout, calories);

    // Forward the payload to Python
    const response = await pythonClient.post("/generate_from_logs", {
      logs: userLogs,
      prompt: prompt,
    });

    return res.json(response.data);
  } catch (err) {
    console.error("Error generating program from logs:", err.message);
    const statusCode = err.response?.status || 500;
    const errorMessage =
      err.response?.data?.detail || "Failed to generate log-based RAG response from Python service.";
    return res.status(statusCode).json({ error: errorMessage });
  }
};

/**
 * Endpoint for uploading PDF/TXT documents.
 * Forwards the file in-memory buffer to the Python service using Axios and FormData.
 */
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided in the upload request." });
    }

    const form = new FormData();
    form.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await pythonClient.post("/upload", form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    return res.json(response.data);
  } catch (err) {
    console.error("Error uploading document to Python service:", err.message);
    const statusCode = err.response?.status || 500;
    const errorMessage =
      err.response?.data?.detail || "Failed to upload document to the RAG service.";
    return res.status(statusCode).json({ error: errorMessage });
  }
};

/**
 * Endpoint to query the document collection (Chatbot query).
 * Forwards query input to Python and gets vector search context + generated answer.
 */
export const queryDocument = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt/Query string is required." });
    }

    const response = await pythonClient.post("/query", {
      query: prompt,
    });

    return res.json(response.data);
  } catch (err) {
    console.error("Error querying Python RAG service:", err.message);
    const statusCode = err.response?.status || 500;
    const errorMessage =
      err.response?.data?.detail || "Failed to query the RAG service.";
    return res.status(statusCode).json({ error: errorMessage });
  }
};

/**
 * Endpoint to delete a document and its stored vector representation.
 */
export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    if (!documentId) {
      return res.status(400).json({ error: "Document ID parameter is required." });
    }

    const response = await pythonClient.delete(`/delete/${documentId}`);
    return res.json(response.data);
  } catch (err) {
    console.error("Error deleting document from Python service:", err.message);
    const statusCode = err.response?.status || 500;
    const errorMessage =
      err.response?.data?.detail || "Failed to delete document from the RAG service.";
    return res.status(statusCode).json({ error: errorMessage });
  }
};

/**
 * Endpoint to check ChromaDB status.
 */
export const getStatus = async (req, res) => {
  try {
    const response = await pythonClient.get("/status");
    return res.json(response.data);
  } catch (err) {
    console.error("Error getting status from Python service:", err.message);
    const statusCode = err.response?.status || 500;
    const errorMessage =
      err.response?.data?.detail || "Failed to retrieve RAG service status.";
    return res.status(statusCode).json({ error: errorMessage });
  }
};
