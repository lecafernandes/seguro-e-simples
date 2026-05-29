import { ShieldCheck } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="grid size-10 place-items-center rounded-2xl bg-gradient-hero shadow-soft">
        <ShieldCheck className="size-5 text-primary-foreground" strokeWidth={2.4} />
      </div>
      <div className="leading-tight">
        <p className="font-display text-lg font-extrabold text-foreground">Não Cai Nessa</p>
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Proteção contra golpes</p>
      </div>
    </div>
  );
}