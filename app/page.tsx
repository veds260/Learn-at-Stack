import { db } from "@/lib/db";
import { resources, categories } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { ResourceCard } from "@/components/ui/resource-card";

export const dynamic = "force-dynamic";

async function getResources() {
  const result = await db
    .select({
      id: resources.id,
      title: resources.title,
      slug: resources.slug,
      description: resources.description,
      thumbnail: resources.thumbnail,
      type: resources.type,
      author: resources.author,
      categoryName: categories.name,
      categoryColor: categories.color,
    })
    .from(resources)
    .leftJoin(categories, eq(resources.categoryId, categories.id))
    .orderBy(desc(resources.createdAt));

  return result;
}

export default async function HomePage() {
  const allResources = await getResources();

  return (
    <div className="min-h-screen bg-black">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-500/3 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="relative pt-52 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
              Inner Circle
            </h1>
            <p className="text-zinc-500 text-lg max-w-md mx-auto font-light tracking-wide">
              Exclusive resources for members
            </p>
          </div>

          {/* Resources Grid */}
          {allResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  title={resource.title}
                  description={resource.description}
                  slug={resource.slug}
                  thumbnail={resource.thumbnail}
                  type={resource.type}
                  category={resource.categoryName}
                  categoryColor={resource.categoryColor}
                  author={resource.author}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-zinc-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <p className="text-zinc-500 font-light">
                New resources dropping soon
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
