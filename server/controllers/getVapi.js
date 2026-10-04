import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/call", async (req, res) => {
  try {
    const vapiAuthHeader = `Bearer ${process.env.VITE_VAPI_PUBLIC_KEY}`;
    console.log("Loaded from .env:", process.env.VITE_VAPI_PUBLIC_KEY);
    console.log("Sending Vapi Authorization:", vapiAuthHeader);

    const body = {
      workflow_id: process.env.VAPI_PRIVATE_KEY,
    };

    const response = await fetch("https://api.vapi.ai/v1/workflows/call", {
      method: "POST",
      headers: {
        Authorization: vapiAuthHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("Vapi workflow call sent");

    const data = await response.json();

    if (!response.ok) {
      console.error("Vapi API Error:", data);
      return res
        .status(response.status)
        .json({ error: "Vapi API Error", message: data });
    }

    res.json(data);
  } catch (err) {
    console.error("Vapi Error:", err);
    res.status(500).json({ error: "Vapi call failed" });
  }
});

export default router;
