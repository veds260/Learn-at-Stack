import { COMMUNITY_POSTS, type CommunityPost } from "@/lib/community-posts";

// A heart so the like count reads as a real X stat, not decoration.
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-red-500/80">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function PostCard({ post }: { post: CommunityPost }) {
  return (
    <a
      href={`https://x.com/${post.handle}/status/${post.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group/card shrink-0 w-[330px] rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 transition-colors hover:border-zinc-700 hover:bg-zinc-900/70"
    >
      <div className="flex items-center gap-3 mb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.avatar}
          alt={post.name}
          className="w-9 h-9 rounded-full object-cover bg-zinc-800"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white truncate">{post.name}</p>
          <p className="text-xs text-zinc-500 truncate">@{post.handle}</p>
        </div>
        {post.tag && (
          <span className="shrink-0 rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-red-400/90">
            {post.tag}
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-300 leading-relaxed line-clamp-4">
        {post.text}
      </p>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500">
        <HeartIcon />
        {post.likes.toLocaleString()}
      </div>
    </a>
  );
}

function Row({
  posts,
  direction,
}: {
  posts: CommunityPost[];
  direction: "left" | "right";
}) {
  // The list is rendered twice so the track can loop seamlessly: the animation
  // shifts by exactly one copy width (-50% of the doubled track).
  return (
    <div className="marquee-row overflow-hidden">
      <div
        className={`marquee-track flex gap-4 w-max ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
      >
        {[...posts, ...posts].map((post, i) => (
          <PostCard key={`${post.id}-${i}`} post={post} />
        ))}
      </div>
    </div>
  );
}

export function CommunityMarquee() {
  const mid = Math.ceil(COMMUNITY_POSTS.length / 2);
  const topRow = COMMUNITY_POSTS.slice(0, mid);
  const bottomRow = COMMUNITY_POSTS.slice(mid);

  return (
    <section className="mb-20">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white">
          The community, in their words
        </h2>
        <p className="text-zinc-500 text-sm mt-2 font-light">
          Real posts from members. Hover to pause, tap to open.
        </p>
      </div>

      {/* Transparency mask fades the rows into the black page at both edges. */}
      <div className="community-marquee-mask space-y-4">
        <Row posts={topRow} direction="left" />
        <Row posts={bottomRow} direction="right" />
      </div>
    </section>
  );
}
