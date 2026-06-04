// Community at a glance. Numbers are from the Stack growth case study and are
// kept in sync with it: members, UGC, clipper reach, workshops, activation reach.

interface Stat {
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { value: "1,000+", label: "members" },
  { value: "250+", label: "pieces of UGC" },
  { value: "500k", label: "clipper impressions" },
  { value: "~15", label: "live workshops" },
  { value: "100k", label: "activation reach" },
];

export function StatsBand() {
  return (
    <section className="mb-20">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-x divide-y md:divide-y-0 divide-zinc-800/60 rounded-2xl border border-zinc-800/60 overflow-hidden">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center px-4 py-8 text-center"
          >
            <span className="text-3xl md:text-4xl font-light tracking-tight text-white tabular-nums">
              {stat.value}
            </span>
            <span className="mt-1.5 text-xs md:text-sm text-zinc-500 font-light">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
