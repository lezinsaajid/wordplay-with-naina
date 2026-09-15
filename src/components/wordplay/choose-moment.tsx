import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MomentButtons } from "./moment-buttons";
import { getMoment, type MomentId } from "@/lib/wordplay";

export function ChooseMoment() {
  const [selected, setSelected] = useState<MomentId | null>(null);
  const moment = selected ? getMoment(selected) : undefined;

  return (
    <section aria-labelledby="choose-heading">
      <h2
        id="choose-heading"
        className="font-display text-[clamp(1.6rem,3.4vw,2.2rem)] font-semibold tracking-tight"
      >
        What are we talking about?
      </h2>

      <div className="mt-6">
        <MomentButtons selected={selected} onSelect={setSelected} />
      </div>

      {moment ? (
        <div
          key={moment.id}
          className="rise mt-8 flex flex-col items-start gap-5 border-t border-border pt-8"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
            Alright, let&rsquo;s do this &middot; {moment.label}
          </p>
          <p className="max-w-[38ch] font-display text-[clamp(1.3rem,2.6vw,1.75rem)] italic leading-snug">
            &ldquo;{moment.scenario}&rdquo;
          </p>
          <Link
            to="/talk/$moment"
            params={{ moment: moment.id }}
            className="rounded-full bg-foreground px-8 py-4 text-[15px] font-semibold text-background transition-colors duration-200 hover:bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.98]"
          >
            Talk to Naina &rarr;
          </Link>
        </div>
      ) : null}
    </section>
  );
}
