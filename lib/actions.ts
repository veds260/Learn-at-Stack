"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db";
import { resources, categories } from "./db/schema";
import type { GalleryImage, ResourceStatus } from "./db/schema";
import { eq } from "drizzle-orm";

interface ResourceData {
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail: string;
  type: string;
  status: string;
  categoryId: string;
  externalUrl: string;
  videoUrl: string;
  transcript: string;
  eventDate: string;
  speakers: string;
  gallery: GalleryImage[];
  author: string;
}

interface CategoryData {
  name: string;
  slug: string;
  color: string;
}

export async function getResource(id: string) {
  const [resource] = await db
    .select()
    .from(resources)
    .where(eq(resources.id, id))
    .limit(1);

  return resource;
}

export async function createResource(data: ResourceData) {
  await db.insert(resources).values({
    title: data.title,
    slug: data.slug,
    description: data.description || null,
    content: data.content || null,
    thumbnail: data.thumbnail || null,
    type: data.type,
    status: data.status || "draft",
    categoryId: data.categoryId || null,
    externalUrl: data.externalUrl || null,
    videoUrl: data.videoUrl || null,
    transcript: data.transcript || null,
    eventDate: data.eventDate ? new Date(data.eventDate) : null,
    speakers: data.speakers || null,
    gallery: data.gallery?.length ? data.gallery : null,
    author: data.author || null,
  });

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function updateResource(id: string, data: ResourceData) {
  await db
    .update(resources)
    .set({
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      content: data.content || null,
      thumbnail: data.thumbnail || null,
      type: data.type,
      status: data.status || "draft",
      categoryId: data.categoryId || null,
      externalUrl: data.externalUrl || null,
      videoUrl: data.videoUrl || null,
      transcript: data.transcript || null,
      eventDate: data.eventDate ? new Date(data.eventDate) : null,
      speakers: data.speakers || null,
      gallery: data.gallery?.length ? data.gallery : null,
      author: data.author || null,
      updatedAt: new Date(),
    })
    .where(eq(resources.id, id));

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  revalidatePath(`/resources/${data.slug}`);
}

// Approve (publish), send back to draft, or move to pending — the review gate.
export async function setResourceStatus(id: string, status: ResourceStatus) {
  await db
    .update(resources)
    .set({
      status,
      // Stamp the publish date when it actually goes live.
      ...(status === "published" ? { published: new Date() } : {}),
      updatedAt: new Date(),
    })
    .where(eq(resources.id, id));

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function deleteResource(id: string) {
  await db.delete(resources).where(eq(resources.id, id));

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function createCategory(data: CategoryData) {
  await db.insert(categories).values({
    name: data.name,
    slug: data.slug,
    color: data.color,
  });

  revalidatePath("/admin/dashboard");
}

export async function deleteCategory(id: string) {
  // First, remove category from any resources using it
  await db
    .update(resources)
    .set({ categoryId: null })
    .where(eq(resources.categoryId, id));

  await db.delete(categories).where(eq(categories.id, id));

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}
