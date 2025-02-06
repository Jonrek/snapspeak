import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertRecordingSchema } from "@shared/schema";

export function registerRoutes(app: Express) {
  // Get all recordings
  app.get("/api/recordings", async (_req, res) => {
    const recordings = await storage.getAllRecordings();
    res.json(recordings);
  });

  // Create new recording
  app.post("/api/recordings", async (req, res) => {
    const result = insertRecordingSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid recording data" });
    }

    const recording = await storage.createRecording(result.data);
    res.status(201).json(recording);
  });

  // Delete recording
  app.delete("/api/recordings/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid recording ID" });
    }

    await storage.deleteRecording(id);
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
