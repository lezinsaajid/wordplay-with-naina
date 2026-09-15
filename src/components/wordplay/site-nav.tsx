import { Link } from "@tanstack/react-router";

export function SiteNav() {
  return (
    <header className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-6 sm:px-10">
      <Link to="/" className="font-display text-[26px] font-bold tracking-tight">
        WordPlay
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          to="/practice"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          activeProps={{ className: "text-foreground" }}
        >
          Practice
        </Link>
        <Link
          to="/words"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          activeProps={{ className: "text-foreground" }}
        >
          Your words
        </Link>
      </nav>
    </header>
  );
}
