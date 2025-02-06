import { recordings, type Recording, type InsertRecording } from "@shared/schema";

export interface IStorage {
  getAllRecordings(): Promise<Recording[]>;
  getRecording(id: number): Promise<Recording | undefined>;
  createRecording(recording: InsertRecording): Promise<Recording>;
  deleteRecording(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private recordings: Map<number, Recording>;
  private currentId: number;

  constructor() {
    this.recordings = new Map();
    this.currentId = 1;
  }

  async getAllRecordings(): Promise<Recording[]> {
    return Array.from(this.recordings.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRecording(id: number): Promise<Recording | undefined> {
    return this.recordings.get(id);
  }

  async createRecording(insertRecording: InsertRecording): Promise<Recording> {
    const id = this.currentId++;
    const recording: Recording = {
      ...insertRecording,
      id,
      createdAt: new Date(),
    };
    this.recordings.set(id, recording);
    return recording;
  }

  async deleteRecording(id: number): Promise<void> {
    this.recordings.delete(id);
  }
}

export const storage = new MemStorage();
