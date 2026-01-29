"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FileText, Video, Link as LinkIcon, BookOpen, Download } from "lucide-react";

interface ResourceCardProps {
  title: string;
  description: string | null;
  slug: string;
  thumbnail: string | null;
  type: string;
  category: string | null;
  categoryColor: string | null;
  author: string | null;
}

const typeIcons: Record<string, React.ReactNode> = {
  guide: <BookOpen className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  document: <FileText className="w-4 h-4" />,
  link: <LinkIcon className="w-4 h-4" />,
  download: <Download className="w-4 h-4" />,
};

export function ResourceCard({
  title,
  description,
  slug,
  thumbnail,
  type,
  category,
  categoryColor,
  author,
}: ResourceCardProps) {
  return (
    <Link href={`/resources/${slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="group relative h-full overflow-hidden rounded-2xl bg-zinc-950/50 backdrop-blur-xl border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300"
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />
        </div>

        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950">
              <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-600">
                {typeIcons[type] || <FileText className="w-8 h-8" />}
              </div>
            </div>
          )}

          {/* Type badge */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs font-medium text-zinc-300 flex items-center gap-1.5">
            {typeIcons[type] || <FileText className="w-3 h-3" />}
            <span className="capitalize">{type}</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-5">
          {/* Category badge */}
          {category && (
            <span
              className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-3"
              style={{
                backgroundColor: `${categoryColor || "#ef4444"}15`,
                color: categoryColor || "#ef4444",
              }}
            >
              {category}
            </span>
          )}

          <h3 className="font-medium text-lg text-white mb-2 line-clamp-2 group-hover:text-zinc-100 transition-colors">
            {title}
          </h3>

          {description && (
            <p className="text-sm text-zinc-500 line-clamp-2 mb-3">
              {description}
            </p>
          )}

          {author && (
            <p className="text-xs text-zinc-600">
              by {author}
            </p>
          )}
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.article>
    </Link>
  );
}
