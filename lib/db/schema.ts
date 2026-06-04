import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";

export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  color: varchar("color", { length: 7 }).default("#ef4444"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Content types shown on the portal.
export const RESOURCE_TYPES = [
  "workshop",
  "article",
  "tool",
  "case_study",
  "guide",
  "video",
] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

// Review workflow. Nothing reaches the public site until an admin publishes it.
export const RESOURCE_STATUSES = ["draft", "pending", "published"] as const;
export type ResourceStatus = (typeof RESOURCE_STATUSES)[number];

// A single screenshot/image in a case study (or any) gallery.
export type GalleryImage = { url: string; caption?: string };

export const resources = pgTable("resources", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  content: text("content"),
  thumbnail: text("thumbnail"),
  type: varchar("type", { length: 50 }).notNull().default("article"),
  // Review gate. Default is "published" so existing rows backfill as live on
  // migration; the app always sets this explicitly (drafts from admin, pending
  // from the Claude ingest endpoint), so the default only governs that backfill.
  status: varchar("status", { length: 20 }).notNull().default("published"),
  categoryId: uuid("category_id").references(() => categories.id),
  externalUrl: text("external_url"),
  videoUrl: text("video_url"),
  // Workshop-specific source material.
  transcript: text("transcript"),
  eventDate: timestamp("event_date"),
  speakers: text("speakers"),
  // Case-study (and general) screenshot gallery.
  gallery: jsonb("gallery").$type<GalleryImage[]>(),
  author: varchar("author", { length: 100 }),
  // Who created the item (e.g. "claude" for ingested drafts, else admin name).
  submittedBy: varchar("submitted_by", { length: 100 }),
  published: timestamp("published").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;
