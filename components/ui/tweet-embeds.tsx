import { Suspense } from "react";
import { Tweet } from "react-tweet";
import type { EmbedItem } from "@/lib/db/schema";

// Pull the numeric tweet id out of an X/Twitter URL.
function tweetId(url: string): string | null {
  const m = url.match(/status(?:es)?\/(\d+)/);
  return m ? m[1] : null;
}

function EmbedSkeleton() {
  return (
    <div className="h-64 w-full rounded-2xl border border-zinc-800/50 bg-zinc-900/40 animate-pulse" />
  );
}

export function TweetEmbeds({
  embeds,
  heading,
}: {
  embeds: EmbedItem[];
  heading: string;
}) {
  const valid = embeds
    .map((e) => ({ ...e, id: tweetId(e.url) }))
    .filter((e): e is EmbedItem & { id: string } => !!e.id);

  if (valid.length === 0) return null;

  return (
    // react-tweet reads this attribute to render its dark theme.
    <div data-theme="dark" className="mt-12 space-y-6">
      <h2 className="text-2xl font-light tracking-tight text-white">
        {heading}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 [&_.react-tweet-theme]:my-0">
        {valid.map((e, idx) => (
          <div key={`${e.id}-${idx}`}>
            <Suspense fallback={<EmbedSkeleton />}>
              <Tweet id={e.id} />
            </Suspense>
            {e.caption && (
              <p className="text-sm text-zinc-500 mt-1 mb-4 px-1">
                {e.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
