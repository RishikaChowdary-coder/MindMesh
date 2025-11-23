// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// ✨ API: Organize Brain Dump into structured thoughts
app.post("/organize", async (req, res) => {
  try {
    const { text } = req.body;
    const prompt = `
      Organize these messy thoughts into clean bullet points and find relationships:
      ${text}
      Return JSON with:
      {
        "categories": [...],
        "connections": [...]
      }`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    res.json(JSON.parse(responseText));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Processing failed" });
  }
});

// ✨ API: Convert organized thoughts into a Mind Map structure
app.post("/mindmap", async (req, res) => {
  try {
    const { structured } = req.body;
    const prompt = `
      Convert this structured idea data into a mindmap node structure.
      ${JSON.stringify(structured)}
      Return JSON like:
      {
        "root": "Main Idea",
        "nodes": [
          { "id": 1, "label": "...", "parent": null },
          { "id": 2, "label": "...", "parent": 1 }
        ]
      }`;

    const result = await model.generateContent(prompt);
    res.json(JSON.parse(result.response.text()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Mind map generation failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ MindMesh Server Running on ${PORT}`));
