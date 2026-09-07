import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { campaigns, generations, InsertUser, prompts, userSettings, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod", "company", "jobTitle"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  } else {
    values.lastSignedIn = new Date();
    updateSet.lastSignedIn = new Date();
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listPrompts(userId: number, search = "", category?: string) {
  const db = await getDb();
  if (!db) return [];
  const filters = [eq(prompts.userId, userId)];
  if (search) filters.push(or(like(prompts.title, `%${search}%`), like(prompts.promptText, `%${search}%`))!);
  if (category && category !== "All") filters.push(eq(prompts.category, category));
  return db.select().from(prompts).where(and(...filters)).orderBy(desc(prompts.updatedAt));
}

export async function createPrompt(input: typeof prompts.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(prompts).values(input);
  return { id: Number(result[0].insertId) };
}

export async function updatePrompt(userId: number, id: number, input: Partial<typeof prompts.$inferInsert>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(prompts).set(input).where(and(eq(prompts.id, id), eq(prompts.userId, userId)));
  return { success: true };
}

export async function deletePrompt(userId: number, id: number) {
  const db = await getDb();
  if (!db) return null;
  await db.delete(prompts).where(and(eq(prompts.id, id), eq(prompts.userId, userId)));
  return { success: true };
}

export async function createGeneration(input: typeof generations.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(generations).values(input);
  return { id: Number(result[0].insertId) };
}

export async function listGenerations(userId: number, type?: string, search = "") {
  const db = await getDb();
  if (!db) return [];
  const filters = [eq(generations.userId, userId)];
  if (type && type !== "All") filters.push(eq(generations.type, type as any));
  if (search) filters.push(or(like(generations.title, `%${search}%`), like(generations.prompt, `%${search}%`))!);
  return db.select().from(generations).where(and(...filters)).orderBy(desc(generations.createdAt));
}

export async function createCampaign(input: typeof campaigns.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(campaigns).values(input);
  return { id: Number(result[0].insertId) };
}

export async function listCampaigns(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(campaigns).where(eq(campaigns.userId, userId)).orderBy(desc(campaigns.createdAt));
}

export async function getProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result[0];
}

export async function updateProfile(userId: number, input: { name?: string; company?: string; jobTitle?: string }) {
  const db = await getDb();
  if (!db) return null;
  await db.update(users).set(input).where(eq(users.id, userId));
  return getProfile(userId);
}

export async function getSettings(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userSettings).where(eq(userSettings.userId, userId)).limit(1);
  return result[0];
}

export async function upsertSettings(userId: number, input: Partial<typeof userSettings.$inferInsert>) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(userSettings).values({ userId, ...input }).onDuplicateKeyUpdate({ set: input });
  return getSettings(userId);
}

export async function getStats(userId: number) {
  const db = await getDb();
  if (!db) return { totalGenerations: 0, textGenerated: 0, imagesGenerated: 0, codeGenerated: 0, savedPrompts: 0, campaigns: 0 };
  const [generationRows, promptRows, campaignRows] = await Promise.all([
    db.select({ type: generations.type, count: sql<number>`count(*)` }).from(generations).where(eq(generations.userId, userId)).groupBy(generations.type),
    db.select({ count: sql<number>`count(*)` }).from(prompts).where(eq(prompts.userId, userId)),
    db.select({ count: sql<number>`count(*)` }).from(campaigns).where(eq(campaigns.userId, userId)),
  ]);
  const countFor = (type: string) => Number(generationRows.find((row) => row.type === type)?.count ?? 0);
  return {
    totalGenerations: generationRows.reduce((sum, row) => sum + Number(row.count), 0),
    textGenerated: countFor("text"),
    imagesGenerated: countFor("image"),
    codeGenerated: countFor("code"),
    savedPrompts: Number(promptRows[0]?.count ?? 0),
    campaigns: Number(campaignRows[0]?.count ?? 0),
  };
}
