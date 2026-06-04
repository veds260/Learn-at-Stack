import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resources, categories, RESOURCE_TYPES } from "@/lib/db/schema";
import type { GalleryImage, EmbedItem, ResourceType } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Claude ingest endpoint.
//
// This is how generated content (e.g. a workshop article drafted from a Fathom
// transcript) gets pushed into the portal. Everything lands as `status:
// "pending"` so it sits in the admin queue and never goes live until an admin
// approves it.
//
// Auth: send `Authorization: Bearer <LEARN_INGEST_KEY>`.
//
// Body (JSON):
// {
//   "type": "workshop" | "article" | "tool" | "case_study" | "guide",
//   "title": "string (required)",
//   "slug": "optional-kebab-case",        // auto-generated + de-duped if omitted
//   "description": "card blurb",
//   "content": "<h2>HTML body…</h2>",     // rich text / article body
//   "transcript": "raw workshop transcript",
//   "videoUrl": "https://youtube.com/watch?v=…",
//   "speakers": "@elizacreatez, @auntiepaca",
//   "eventDate": "2026-06-02",
//   "gallery": [{ "url": "https://…", "caption": "…" }],
//   "embeds": [{ "url": "https://x.com/…/status/…", "caption": "…" }],
//   "thumbnail": "https://…",
//   "externalUrl": "https://…",           // for tools
//   "author": "Stack Daily",
//   "categorySlug": "career-growth"       // optional, matched to an existing category
// }

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 240);
}

async function uniqueSlug(base: string): Promise<string> {
  const root = base || "untitled";
  let candidate = root;
  let n = 2;
  // Keep suffixing until the slug is free (slug column is unique).
  while (true) {
    const [existing] = await db
      .select({ id: resources.id })
      .from(resources)
      .where(eq(resources.slug, candidate))
      .limit(1);
    if (!existing) return candidate;
    candidate = `${root}-${n++}`;
  }
}

export async function POST(request: NextRequest) {
  // --- Auth ---
  const expected = process.env.LEARN_INGEST_KEY;
  if (!expected) {
    return NextResponse.json(
      { error: "Ingest is not configured (LEARN_INGEST_KEY unset)" },
      { status: 503 }
    );
  }
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // --- Parse + validate ---
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const rawType = typeof body.type === "string" ? body.type : "article";
  const type: ResourceType = (
    RESOURCE_TYPES as readonly string[]
  ).includes(rawType)
    ? (rawType as ResourceType)
    : "article";

  const str = (v: unknown): string | null =>
    typeof v === "string" && v.trim() ? v.trim() : null;

  // Optional category lookup by slug.
  let categoryId: string | null = null;
  const categorySlug = str(body.categorySlug);
  if (categorySlug) {
    const [cat] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, categorySlug))
      .limit(1);
    if (cat) categoryId = cat.id;
  }

  // Gallery: accept array of {url, caption?}.
  let gallery: GalleryImage[] | null = null;
  if (Array.isArray(body.gallery)) {
    const cleaned = body.gallery
      .filter(
        (g): g is { url: string; caption?: string } =>
          !!g && typeof (g as { url?: unknown }).url === "string"
      )
      .map((g) => ({
        url: g.url,
        ...(typeof g.caption === "string" ? { caption: g.caption } : {}),
      }));
    if (cleaned.length) gallery = cleaned;
  }

  // Embeds: accept array of {url, caption?} pointing at X/Twitter posts.
  let embeds: EmbedItem[] | null = null;
  if (Array.isArray(body.embeds)) {
    const cleaned = body.embeds
      .filter(
        (e): e is { url: string; caption?: string } =>
          !!e && typeof (e as { url?: unknown }).url === "string"
      )
      .map((e) => ({
        url: e.url,
        ...(typeof e.caption === "string" ? { caption: e.caption } : {}),
      }));
    if (cleaned.length) embeds = cleaned;
  }

  let eventDate: Date | null = null;
  const eventDateStr = str(body.eventDate);
  if (eventDateStr) {
    const d = new Date(eventDateStr);
    if (!isNaN(d.getTime())) eventDate = d;
  }

  const requestedSlug = str(body.slug);
  const slug = await uniqueSlug(
    requestedSlug ? slugify(requestedSlug) : slugify(title)
  );

  const [created] = await db
    .insert(resources)
    .values({
      title,
      slug,
      description: str(body.description),
      content: str(body.content),
      thumbnail: str(body.thumbnail),
      type,
      status: "pending", // always lands in the review queue
      categoryId,
      externalUrl: str(body.externalUrl),
      videoUrl: str(body.videoUrl),
      transcript: str(body.transcript),
      eventDate,
      speakers: str(body.speakers),
      gallery,
      embeds,
      author: str(body.author) ?? "Stack Daily",
      submittedBy: "claude",
    })
    .returning({ id: resources.id, slug: resources.slug });

  return NextResponse.json(
    {
      ok: true,
      id: created.id,
      slug: created.slug,
      status: "pending",
      message: "Draft queued for admin review.",
      reviewUrl: "/admin/dashboard",
    },
    { status: 201 }
  );
}
