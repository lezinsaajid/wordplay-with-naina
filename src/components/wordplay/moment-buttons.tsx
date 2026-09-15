import { moments, type MomentId } from "@/lib/wordplay";

type Props = {
  selected?: MomentId | null;
  onSelect: (id: MomentId) => void;
};

export function MomentButtons({ selected, onSelect }: Props) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2">
      {moments.map((m) => {
        const isActive = selected === m.id;
        return (
          <li key={m.id}>
            <button
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(m.id)}
              className={`group flex h-full w-full flex-col items-start gap-2 px-6 py-7 text-left transition-colors duration-200 active:scale-[0.995] ${
                isActive
                  ? "bg-foreground text-background"
                  : "bg-background hover:bg-paper-deep"
              }`}
            >
              <span className="font-display text-[26px] font-semibold uppercase tracking-tight sm:text-[30px]">
                {m.label}
              </span>
              <span
                className={`max-w-[34ch] text-[14px] leading-snug ${
                  isActive ? "text-background/70" : "text-muted-foreground"
                }`}
              >
                {m.line}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
