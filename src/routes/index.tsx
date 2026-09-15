import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/wordplay/site-nav";
import { ChooseMoment } from "@/components/wordplay/choose-moment";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WordPlay — you already know more words than you use" },
      {
        name: "description",
        content:
          "Talk. Get unstuck. Find the word. A voice-first conversation with Naina that helps you say what you mean.",
      },
      { property: "og:title", content: "WordPlay — talk, get unstuck, find the word" },
      {
        property: "og:description",
        content:
          "A voice-first conversation with Naina that helps you find better words and use them right away.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="min-h-screen">
      <SiteNav />

      <div className="mx-auto max-w-[1120px] px-6 sm:px-10">
        <section className="grid gap-12 py-12 sm:py-20 lg:grid-cols-[1.35fr_1fr] lg:items-end">
          <div>
            <h1 className="rise max-w-[15ch] text-balance font-display text-[clamp(2.6rem,7.2vw,5.2rem)] font-semibold leading-[0.96] tracking-tight">
              You already know more words than you use.
            </h1>
            <p className="rise mt-6 max-w-[32ch] font-display text-[clamp(1.3rem,2.8vw,1.8rem)] italic text-muted-foreground">
              Talk. Get unstuck. Find the word.
            </p>
            <div className="rise mt-9 flex flex-wrap items-center gap-5">
              <Link
                to="/practice"
                className="rounded-full bg-foreground px-8 py-4 text-[15px] font-semibold text-background transition-colors duration-200 hover:bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.98]"
              >
                Start a conversation &rarr;
              </Link>
              <span className="font-mono text-[11px] tracking-wider text-muted-foreground">
                4 min · voice-first
              </span>
            </div>
          </div>

          <aside className="rise relative rounded-3xl border border-border bg-paper-deep px-7 py-8">
            <div
              aria-hidden="true"
              className="absolute right-7 top-8 size-10 rounded-full border border-brand/40"
            />
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
              Meet Naina
            </p>
            <p className="mt-4 max-w-[26ch] font-display text-[22px] italic leading-snug">
              &ldquo;Your slightly-too-good-with-words friend.&rdquo;
            </p>
            <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-muted-foreground">
              She talks with you, notices where you get stuck, and hands you the
              word you were reaching for. Then you say it out loud.
            </p>
          </aside>
        </section>

        <div className="pb-16 sm:pb-24">
          <ChooseMoment />
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border py-8">
          <span className="font-mono text-[11px] tracking-wider text-muted-foreground">
            No flashcards. No chat bubbles. Just conversation.
          </span>
          <Link
            to="/words"
            className="font-mono text-[11px] tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            Your words &rarr;
          </Link>
        </footer>
      </div>
    </main>
  );
}
