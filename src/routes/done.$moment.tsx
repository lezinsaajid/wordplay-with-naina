import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { noticedNote, sessionWords } from "@/lib/wordplay";

export const Route = createFileRoute("/done/$moment")({
  head: () => ({
    meta: [
      { title: "That was actually good — WordPlay" },
      {
        name: "description",
        content:
          "The words you used today, and one thing Naina noticed about how you explain things.",
      },
      { property: "og:title", content: "Session complete — WordPlay" },
      {
        property: "og:description",
        content: "The words you actually used, plus one thing Naina noticed.",
      },
    ],
  }),
  component: Done,
});

function Done() {
  const { moment } = useParams({ from: "/done/$moment" });

  return (
    <main className="mx-auto min-h-screen max-w-[760px] px-6 py-14 sm:px-10 sm:py-20">
      <h1 className="rise font-display text-[clamp(2.2rem,6vw,3.6rem)] font-semibold leading-[1.02] tracking-tight">
        Okayyy. That was actually good.
      </h1>

      <section className="mt-14" aria-labelledby="words-today">
        <h2
          id="words-today"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          Your words today
        </h2>
        <ul className="mt-5 divide-y divide-border border-y border-border">
          {sessionWords.map((w) => (
            <li
              key={w.word}
              className="flex flex-wrap items-baseline justify-between gap-2 py-5"
            >
              <span className="font-display text-[26px] font-medium tracking-tight">
                {w.word}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {w.status === "Used naturally" ? "used naturally" : "getting there"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="noticed">
        <h2
          id="noticed"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand"
        >
          One thing I noticed
        </h2>
        <p className="mt-4 max-w-[44ch] font-display text-[clamp(1.25rem,2.6vw,1.6rem)] italic leading-snug">
          &ldquo;{noticedNote}&rdquo;
        </p>
      </section>

      <div className="mt-12 flex flex-wrap items-center gap-4">
        <Link
          to="/talk/$moment"
          params={{ moment }}
          className="rounded-full bg-foreground px-8 py-4 text-[15px] font-semibold text-background transition-colors duration-200 hover:bg-brand active:scale-[0.98]"
        >
          Keep talking &rarr;
        </Link>
        <Link
          to="/words"
          className="rounded-full border border-border px-8 py-4 text-[15px] font-medium transition-colors duration-200 hover:border-foreground/40 active:scale-[0.98]"
        >
          See my words &rarr;
        </Link>
      </div>
    </main>
  );
}
