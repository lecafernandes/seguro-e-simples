import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" aria-label="Página inicial">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 text-sm font-semibold">
          <Link
            to="/aprenda"
            className="rounded-full px-4 py-2 text-foreground/80 transition-colors hover:bg-primary-soft hover:text-primary"
            activeProps={{ className: "bg-primary-soft text-primary" }}
          >
            Aprenda
          </Link>
          <Link
            to="/analise"
            className="rounded-full bg-primary px-5 py-2.5 text-primary-foreground shadow-card transition-transform hover:scale-[1.02]"
          >
            Analisar
          </Link>
        </nav>
      </div>
    </header>
  );
}