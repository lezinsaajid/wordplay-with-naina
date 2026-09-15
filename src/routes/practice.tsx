import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/wordplay/site-nav";
import { ChooseMoment } from "@/components/wordplay/choose-moment";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice — WordPlay" },
      {
        name: "description",
        content:
          "Pick a moment — work, confidence, travel, networking, everyday — and start talking to Naina.",
      },
      { property: "og:title", content: "Practice — WordPlay" },
      {
        property: "og:description",
        content: "Pick a moment and start a four-minute voice conversation with Naina.",
      },
    ],
  }),
  component: Practice,
});

function Practice() {
  return (
    <main className="min-h-screen">
      <SiteNav />
      <div className="mx-auto max-w-[1120px] px-6 pb-24 pt-10 sm:px-10 sm:pt-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
          Okay, tell me
        </p>
        <p className="mt-4 mb-12 max-w-[30ch] font-display text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-[1.02] tracking-tight">
          Four minutes. You do most of the talking.
        </p>
        <ChooseMoment />
      </div>
    </main>
  );
}
