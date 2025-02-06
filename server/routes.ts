import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertRecordingSchema } from "@shared/schema";
import { setupAuth } from "./auth";

export function registerRoutes(app: Express) {
  // Set up authentication routes
  setupAuth(app);

  // Get all recordings
  app.get("/api/recordings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "يجب تسجيل الدخول أولاً" });
    }
    const recordings = await storage.getAllRecordings();
    res.json(recordings);
  });

  // Create new recording
  app.post("/api/recordings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "يجب تسجيل الدخول أولاً" });
    }

    const result = insertRecordingSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "بيانات غير صالحة" });
    }

    const recording = await storage.createRecording(result.data, req.user.id);
    res.status(201).json(recording);
  });

  // Delete recording
  app.delete("/api/recordings/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "يجب تسجيل الدخول أولاً" });
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "معرف التسجيل غير صالح" });
    }

    await storage.deleteRecording(id);
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}