import { recordings, type Recording, type InsertRecording } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getAllRecordings(): Promise<Recording[]>;
  getRecording(id: number): Promise<Recording | undefined>;
  createRecording(recording: InsertRecording): Promise<Recording>;
  deleteRecording(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getAllRecordings(): Promise<Recording[]> {
    return await db.select().from(recordings).orderBy(recordings.createdAt);
  }

  async getRecording(id: number): Promise<Recording | undefined> {
    const [recording] = await db.select().from(recordings).where(eq(recordings.id, id));
    return recording;
  }

  async createRecording(insertRecording: InsertRecording): Promise<Recording> {
    const [recording] = await db
      .insert(recordings)
      .values(insertRecording)
      .returning();
    return recording;
  }

  async deleteRecording(id: number): Promise<void> {
    await db.delete(recordings).where(eq(recordings.id, id));
  }
}

export const storage = new DatabaseStorage();