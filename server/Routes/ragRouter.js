import express from "express";
import multer from "multer";
import protect from "../middleware/protect.js";
import {
  generateProgram,
  uploadDocument,
  queryDocument,
  deleteDocument,
  getStatus,
} from "../controllers/ragController.js";

const router = express.Router();

// Memory storage is ideal as we forward the file buffer directly to FastAPI
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Log-based RAG endpoint (backward compatibility)
router.post("/generate", protect, generateProgram);

// PDF/TXT document RAG endpoints
router.post("/upload", protect, upload.single("file"), uploadDocument);
router.post("/query", protect, queryDocument);
router.delete("/delete/:documentId", protect, deleteDocument);
router.get("/status", protect, getStatus);

export default router;
