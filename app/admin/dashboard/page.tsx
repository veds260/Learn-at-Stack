import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { resources, categories } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { AdminDashboard } from "./admin-dashboard";

export const dynamic = "force-dynamic";

async function getResources() {
  const result = await db
    .select({
      id: resources.id,
      title: resources.title,
      slug: resources.slug,
      description: resources.description,
      type: resources.type,
      categoryName: categories.name,
      createdAt: resources.createdAt,
    })
    .from(resources)
    .leftJoin(categories, eq(resources.categoryId, categories.id))
    .orderBy(desc(resources.createdAt));

  return result;
}

async function getCategories() {
  return db.select().from(categories).orderBy(categories.name);
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin");
  }

  const [allResources, allCategories] = await Promise.all([
    getResources(),
    getCategories(),
  ]);

  return (
    <AdminDashboard
      resources={allResources}
      categories={allCategories}
      userEmail={session.user?.email || ""}
    />
  );
}
