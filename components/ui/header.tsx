"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-black/80 backdrop-blur-xl"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Stack Daily"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
          <span className="text-zinc-500 text-sm font-light">/ learn</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Resources
          </Link>
          <a
            href="https://t.me/stackdaily"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-4 py-2 rounded-full bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all border border-zinc-800"
          >
            Join Community
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
