import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["student", "librarian"] }).notNull(),
  rememberToken: text("remember_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const recordings = pgTable("recordings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  originalText: text("original_text").notNull(),
  audioUrl: text("audio_url").notNull(),
  userId: serial("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  rememberToken: true,
}).extend({
  email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
  password: z.string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(/[A-Z]/, "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل")
    .regex(/[a-z]/, "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل")
    .regex(/[0-9]/, "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل"),
  confirmPassword: z.string(),
  role: z.enum(["student", "librarian"], {
    required_error: "يرجى اختيار نوع المستخدم",
  }),
  rememberMe: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

export const insertRecordingSchema = createInsertSchema(recordings).omit({
  id: true,
  createdAt: true,
  userId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRecording = z.infer<typeof insertRecordingSchema>;
export type Recording = typeof recordings.$inferSelect;