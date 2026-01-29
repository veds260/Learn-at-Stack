import { db } from "@/lib/db";
import { resources, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ShareButton } from "./share-button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getResource(slug: string) {
  const [resource] = await db
    .select({
      id: resources.id,
      title: resources.title,
      slug: resources.slug,
      description: resources.description,
      content: resources.content,
      thumbnail: resources.thumbnail,
      type: resources.type,
      externalUrl: resources.externalUrl,
      author: resources.author,
      published: resources.published,
      categoryName: categories.name,
      categoryColor: categories.color,
    })
    .from(resources)
    .leftJoin(categories, eq(resources.categoryId, categories.id))
    .where(eq(resources.slug, slug))
    .limit(1);

  return resource;
}

export default async function ResourcePage({ params }: PageProps) {
  const { slug } = await params;
  const resource = await getResource(slug);

  if (!resource) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="relative pt-28 pb-16 px-6">
        <article className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          {/* Header */}
          <header className="mb-10">
            {resource.categoryName && (
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4"
                style={{
                  backgroundColor: `${resource.categoryColor || "#ef4444"}15`,
                  color: resource.categoryColor || "#ef4444",
                }}
              >
                {resource.categoryName}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-4">
              {resource.title}
            </h1>

            {resource.description && (
              <p className="text-lg text-zinc-400 font-light mb-6">
                {resource.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
              {resource.author && (
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {resource.author}
                </span>
              )}
              {resource.published && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(resource.published).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </header>

          {/* Thumbnail */}
          {resource.thumbnail && (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-10 bg-zinc-900 border border-zinc-800/50">
              <Image
                src={resource.thumbnail}
                alt={resource.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Share on X button */}
          <ShareButton title={resource.title} slug={resource.slug} />

          {/* Content */}
          {resource.content && (
            <div
              className="prose prose-invert prose-zinc max-w-none
                prose-headings:font-light prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-zinc-400 prose-p:leading-relaxed
                prose-a:text-red-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-medium
                prose-ul:text-zinc-400 prose-ol:text-zinc-400
                prose-li:marker:text-zinc-600
                prose-blockquote:border-l-red-500/50 prose-blockquote:bg-zinc-900/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-zinc-300
                prose-code:text-red-400 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800"
              dangerouslySetInnerHTML={{ __html: resource.content }}
            />
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
