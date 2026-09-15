import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/wordplay/site-nav";
import { sessionWords } from "@/lib/wordplay";

export const Route = createFileRoute("/words")({
  head: () => ({
    meta: [
      { title: "Your words — WordPlay" },
      {
        name: "description",
        content:
          "The words that came up while you were talking, with the moment each one belongs to.",
      },
      { property: "og:title", content: "Your words — WordPlay" },
      {
        property: "og:description",
        content: "Words you actually used, kept with the moment they came from.",
      },
    ],
  }),
  component: Words,
});

function Words() {
  return (
    <main className="min-h-screen">
      <SiteNav />
      <div className="mx-auto max-w-[760px] px-6 pb-24 pt-10 sm:px-10 sm:pt-16">
        <h1 className="font-display text-[clamp(2.2rem,6vw,3.4rem)] font-semibold leading-[1.02] tracking-tight">
          Your words
        </h1>
        <p className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-muted-foreground">
          Words that came up while you were talking — not a list someone handed you.
        </p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-brand">
          This session only · nothing is saved yet
        </p>

        <ul className="mt-10 divide-y divide-border border-y border-border">
          {sessionWords.map((w) => (
            <li key={w.word} className="py-7">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-[30px] font-medium tracking-tight">
                  {w.word}
                </h2>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {w.status === "Used naturally" ? "used naturally" : "getting there"}
                </span>
              </div>
              <p className="mt-3 max-w-[46ch] font-display text-[18px] italic text-muted-foreground">
                &ldquo;{w.memory}&rdquo;
              </p>
            </li>
          ))}
        </ul>

        <Link
          to="/practice"
          className="mt-10 inline-block rounded-full bg-foreground px-8 py-4 text-[15px] font-semibold text-background transition-colors duration-200 hover:bg-brand active:scale-[0.98]"
        >
          Start a conversation &rarr;
        </Link>
      </div>
    </main>
  );
}
