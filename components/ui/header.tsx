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
      <div className="max-w-6xl mx-auto px-6 h-44 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="Stack Daily"
            width={540}
            height={144}
            className="h-36 w-auto"
            priority
          />
          <span className="text-zinc-600 text-sm tracking-wide">/ learn</span>
        </Link>

        <a
          href="https://t.me/+q3abpE3xjGszMGQ1"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm px-5 py-2.5 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-all"
        >
          Join Inner Circle
        </a>
      </div>
    </motion.header>
  );
}
