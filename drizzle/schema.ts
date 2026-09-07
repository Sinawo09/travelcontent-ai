import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  company: varchar("company", { length: 180 }),
  jobTitle: varchar("jobTitle", { length: 180 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const prompts = mysqlTable("prompts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  description: text("description"),
  promptText: text("promptText").notNull(),
  optimizedPrompt: text("optimizedPrompt"),
  usedCount: int("usedCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const generations = mysqlTable("generations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["text", "image", "code", "prompt", "campaign"]).notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  prompt: text("prompt").notNull(),
  output: text("output").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  destination: varchar("destination", { length: 180 }).notNull(),
  audience: varchar("audience", { length: 180 }).notNull(),
  duration: int("duration").notNull(),
  goal: varchar("goal", { length: 220 }).notNull(),
  platform: varchar("platform", { length: 80 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const userSettings = mysqlTable("userSettings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  theme: mysqlEnum("theme", ["light", "dark", "system"]).default("light").notNull(),
  language: varchar("language", { length: 50 }).default("English").notNull(),
  defaultTone: varchar("defaultTone", { length: 80 }).default("Professional").notNull(),
  defaultLength: varchar("defaultLength", { length: 50 }).default("Medium").notNull(),
  emailNotifications: int("emailNotifications").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Prompt = typeof prompts.$inferSelect;
export type Generation = typeof generations.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
