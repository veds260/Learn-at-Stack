"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db";
import { resources, categories } from "./db/schema";
import { eq } from "drizzle-orm";

interface ResourceData {
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail: string;
  type: string;
  categoryId: string;
  externalUrl: string;
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
    categoryId: data.categoryId || null,
    externalUrl: data.externalUrl || null,
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
      categoryId: data.categoryId || null,
      externalUrl: data.externalUrl || null,
      author: data.author || null,
      updatedAt: new Date(),
    })
    .where(eq(resources.id, id));

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  revalidatePath(`/resources/${data.slug}`);
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
