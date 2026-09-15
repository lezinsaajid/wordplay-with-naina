import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { getMoment, soundLikeModes } from "@/lib/wordplay";
import { useNainaCall } from "@/hooks/use-naina-call";

export const Route = createFileRoute("/talk/$moment")({
  head: () => ({
    meta: [
      { title: "Talking with Naina — WordPlay" },
      {
        name: "description",
        content:
          "A calm, voice-first conversation. Naina listens, notices, and hands you the word you were reaching for.",
      },
      { property: "og:title", content: "Talking with Naina — WordPlay" },
      {
        property: "og:description",
        content: "Voice-first practice. You talk, Naina finds the word with you.",
      },
    ],
  }),
  component: Talk,
});

type Beat =
  | { kind: "open"; naina: string }
  | { kind: "notice"; heard: string; word: string; note: string }
  | { kind: "mode"; naina: string };

const beats: Beat[] = [
  { kind: "open", naina: "Okay, tell me. What's the idea?" },
  {
    kind: "notice",
    heard: "You said you were 'really nervous' about the presentation.",
    word: "apprehensive",
    note: "Same idea, but it captures that feeling of being worried about something that's coming.",
  },
  {
    kind: "mode",
    naina: "Yeah, I get what you're going for. Want to make that sound a little more confident?",
  },
  {
    kind: "notice",
    heard: "You said the plan was 'good, I think'.",
    word: "sound",
    note: "It says the plan holds up — without you hedging in the same breath.",
  },
];

/** Local states used when Naina isn't connected (prototype walkthrough). */
type Phase = "ready" | "listening" | "thinking" | "naina" | "yourTurn" | "nice";

function Talk() {
  const { moment: momentId } = useParams({ from: "/talk/$moment" });
  const navigate = useNavigate();
  const moment = getMoment(momentId);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [unlocked, setUnlocked] = useState(0);
  const [mode, setMode] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const call = useNainaCall({
    context: {
      moment: moment?.label ?? "Everyday",
      scenario: moment?.scenario ?? "",
    },
    onEnded: () => {
      navigate({ to: "/done/$moment", params: { moment: momentId } });
    },
  });

  const live = call.available;

  const beat: Beat = beats[index] ?? beats[0]!;

  const handleMic = () => {
    if (live) {
      if (call.status === "listening" || call.status === "speaking") {
        call.stop();
      } else if (call.status !== "connecting") {
        void call.start();
      }
      return;
    }
    if (phase === "ready") {
      setPhase("listening");
      return;
    }
    if (phase === "listening") {
      setPhase("thinking");
      after(1200, () => setPhase("naina"));
      return;
    }
    if (phase === "yourTurn") {
      setPhase("listening");
      after(2200, () => {
        setPhase("nice");
        setUnlocked((n) => n + 1);
        after(2000, () => {
          if (index === beats.length - 1) {
            navigate({ to: "/done/$moment", params: { moment: momentId } });
          } else {
            setIndex((i) => i + 1);
            setMode(null);
            setPhase("naina");
          }
        });
      });
    }
  };

  const liveStatus: string =
    call.status === "connecting"
      ? "Connecting…"
      : call.status === "listening"
        ? "Listening"
        : call.status === "speaking"
          ? "Naina's turn"
          : call.status === "error"
            ? "Couldn't start"
            : call.status === "ended"
              ? "That's a wrap"
              : "Tap to talk";

  const status: string = live
    ? liveStatus
    : phase === "ready"
      ? "Tap when you're ready"
      : phase === "listening"
        ? "Listening"
        : phase === "thinking"
          ? "Thinking"
          : phase === "naina"
            ? "Naina's turn"
            : phase === "yourTurn"
              ? "Your turn"
              : "That sounded natural";

  const micLabel = live
    ? call.status === "listening" || call.status === "speaking"
      ? "End conversation"
      : call.status === "connecting"
        ? "Connecting…"
        : "Talk to Naina"
    : phase === "listening"
      ? "Stop talking"
      : phase === "yourTurn"
        ? "Say it out loud"
        : "Talk to Naina";

  const micDisabled = live
    ? call.status === "connecting"
    : phase === "thinking" || phase === "naina" || phase === "nice";

  const micActive = live
    ? call.status === "listening" || call.status === "speaking"
    : phase === "listening" || phase === "yourTurn";

  return (
    <main className="flex min-h-screen flex-col bg-paper-deep">
      <div className="mx-auto flex w-full max-w-[880px] items-center justify-between px-6 py-6 sm:px-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {moment?.label ?? "Session"}
        </span>
        <Link
          to="/"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
        >
          Exit
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-[880px] flex-1 flex-col items-center justify-center px-6 pb-16 text-center sm:px-10">
        <p className="font-display text-[28px] font-medium tracking-tight">Naina</p>
        <p
          aria-live="polite"
          className="mt-2 font-mono text-[12px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          {status}
        </p>

        <div className="relative mt-10 grid size-[220px] place-items-center">
          {micActive ? (
            <>
              <span
                aria-hidden="true"
                className="breathe absolute inset-0 rounded-full border border-brand/40"
              />
              <span
                aria-hidden="true"
                className="breathe absolute inset-4 rounded-full border border-brand/25"
              />
            </>
          ) : null}
          <button
            type="button"
            onClick={handleMic}
            disabled={micDisabled}
            aria-label={micLabel}
            className="relative flex size-44 flex-col items-center justify-center gap-4 rounded-full bg-foreground text-background transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
          >
            <span
              className={`size-3 rounded-full ${
                micActive ? "bg-brand" : "bg-background/40"
              }`}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-background/70">
              {micLabel}
            </span>
          </button>
        </div>

        <div className="mt-10 min-h-[190px] w-full max-w-[46ch]">
          {live && call.error ? (
            <p className="rise font-display text-[clamp(1.2rem,2.6vw,1.6rem)] italic leading-snug text-brand">
              {call.error}
            </p>
          ) : null}

          {live && !call.error && call.status === "idle" ? (
            <p className="font-display text-[clamp(1.3rem,2.8vw,1.75rem)] italic leading-snug">
              Okay, tell me. What&rsquo;s on your mind?
            </p>
          ) : null}

          {live && call.status === "connecting" ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Getting Naina on the line…
            </p>
          ) : null}

          {!live && phase === "naina" && beat.kind === "open" ? (
            <p className="rise font-display text-[clamp(1.4rem,3vw,1.9rem)] italic leading-snug">
              &ldquo;{beat.naina}&rdquo;
            </p>
          ) : null}

          {!live && phase === "naina" && beat.kind === "notice" ? (
            <div className="rise space-y-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
                Naina noticed something
              </p>
              <p className="font-display text-[clamp(1.2rem,2.6vw,1.6rem)] italic leading-snug text-muted-foreground">
                &ldquo;{beat.heard}&rdquo;
              </p>
              <p className="font-display text-[clamp(1.7rem,4vw,2.4rem)] font-semibold tracking-tight">
                Try: {beat.word}
              </p>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                {beat.note}
              </p>
              <button
                type="button"
                onClick={() => setPhase("yourTurn")}
                className="rounded-full bg-foreground px-7 py-3.5 text-[14px] font-semibold text-background transition-colors duration-200 hover:bg-brand active:scale-[0.98]"
              >
                Your turn &rarr;
              </button>
            </div>
          ) : null}

          {!live && phase === "naina" && beat.kind === "mode" ? (
            <div className="rise space-y-5">
              <p className="font-display text-[clamp(1.3rem,2.8vw,1.75rem)] italic leading-snug">
                &ldquo;{beat.naina}&rdquo;
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
                Make me sound like…
              </p>
              <div className="flex flex-wrap justify-center gap-2.5">
                {soundLikeModes.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={mode === m.id}
                    onClick={() => {
                      setMode(m.id);
                      after(700, () => setPhase("yourTurn"));
                    }}
                    className={`rounded-full border px-5 py-2.5 text-[14px] font-medium transition-colors duration-200 active:scale-[0.98] ${
                      mode === m.id
                        ? "border-transparent bg-foreground text-background"
                        : "border-border hover:border-foreground/40"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {!live && phase === "yourTurn" ? (
            <p className="rise font-display text-[clamp(1.3rem,2.8vw,1.75rem)] italic leading-snug">
              Say it your way. I&rsquo;m listening.
            </p>
          ) : null}

          {!live && phase === "nice" ? (
            <p className="rise font-display text-[clamp(1.4rem,3vw,1.9rem)] font-semibold tracking-tight">
              That sounded natural.
            </p>
          ) : null}

          {!live && phase === "thinking" ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Finding your next word…
            </p>
          ) : null}
        </div>

        {unlocked > 0 ? (
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {unlocked} word{unlocked > 1 ? "s" : ""} unlocked
          </p>
        ) : null}
      </div>
    </main>
  );
}
