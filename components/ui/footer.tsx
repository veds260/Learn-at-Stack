"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-600">
          Stack Daily
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://t.me/+q3abpE3xjGszMGQ1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 hover:text-white transition-colors"
          >
            Telegram
          </a>
          <a
            href="https://x.com/stackdailyxyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 hover:text-white transition-colors"
          >
            X
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
