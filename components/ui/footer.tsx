"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-600">
          Stack Daily Inner Circle
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://t.me/stackdaily"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 hover:text-white transition-colors"
          >
            Telegram
          </a>
          <a
            href="https://x.com/stackdaily"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 hover:text-white transition-colors"
          >
            Twitter
          </a>
          <Link
            href="/admin"
            className="text-sm text-zinc-700 hover:text-zinc-500 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
