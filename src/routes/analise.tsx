import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  MessageSquareText,
  Link2,
  Mic,
  Globe,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { RiskMeter } from "@/components/RiskMeter";
import { analyzeText, analyzeLink, analyzeAudio, analyzeSite, type AnalysisResult } from "@/lib/analyze";

const tipoSchema = z.object({
  tipo: z.enum(["texto", "link", "audio", "site"]).default("texto"),
});

export const Route = createFileRoute("/analise")({
  validateSearch: tipoSchema,
  head: () => ({
    meta: [
      { title: "Analisar agora — Não Cai Nessa" },
      { name: "description", content: "Cole uma mensagem, link, áudio ou site para descobrir se pode ser golpe." },
    ],
  }),
  component: AnalisePage,
});

const tabs = [
  { tipo: "texto" as const, label: "Mensagem", icon: MessageSquareText },
  { tipo: "link" as const, label: "Link", icon: Link2 },
  { tipo: "audio" as const, label: "Áudio", icon: Mic },
  { tipo: "site" as const, label: "Site", icon: Globe },
];

const placeholders: Record<string, string> = {
  texto: "Cole aqui a mensagem suspeita que você recebeu...",
  link: "Cole aqui o link, por exemplo: https://...",
  audio: "Descreva ou transcreva o áudio que recebeu...",
  site: "Digite o endereço do site, por exemplo: www.exemplo.com",
};

function AnalisePage() {
  const { tipo } = Route.useSearch();
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  function run() {
    if (!value.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const r =
        tipo === "link" ? analyzeLink(value)
        : tipo === "site" ? analyzeSite(value)
        : tipo === "audio" ? analyzeAudio(value)
        : analyzeText(value);
      setResult(r);
      setLoading(false);
    }, 900);
  }

  function reset() {
    setResult(null);
    setValue("");
  }

  async function share() {
    if (!result) return;
    const text = `[Não Cai Nessa] ${result.headline} (risco ${result.score}%). ${result.recommendation}`;
    if (navigator.share) {
      try { await navigator.share({ title: "Alerta de golpe", text }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(text); alert("Alerta copiado!"); } catch {}
    }
  }

  return (
    <>
      <SiteHeader />

      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" /> Voltar
        </Link>

        <h1 className="mt-6 font-display text-4xl font-extrabold text-foreground sm:text-5xl">
          Vamos analisar juntos.
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Escolha o tipo, cole o conteúdo e toque em <span className="font-semibold text-foreground">Analisar</span>.
        </p>

        {/* Tabs */}
        <div className="mt-8 grid grid-cols-2 gap-2 rounded-2xl bg-secondary p-2 sm:grid-cols-4">
          {tabs.map((t) => {
            const active = t.tipo === tipo;
            return (
              <button
                key={t.tipo}
                onClick={() => { reset(); navigate({ to: "/analise", search: { tipo: t.tipo } }); }}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition-all ${
                  active ? "bg-card text-primary shadow-card" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="size-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Input card */}
        <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
          {tipo === "audio" ? (
            <div className="space-y-5">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/40 px-6 py-10 text-center transition-colors hover:border-primary/40 hover:bg-primary-soft/50">
                <Mic className="size-10 text-primary" />
                <p className="mt-3 text-lg font-bold text-foreground">Enviar áudio do WhatsApp</p>
                <p className="mt-1 text-sm text-muted-foreground">Toque para escolher um arquivo de áudio</p>
                <input type="file" accept="audio/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setValue("Arquivo de áudio selecionado. Descreva abaixo o que a pessoa disse no áudio para analisarmos.");
                }} />
              </label>
              <p className="text-center text-sm text-muted-foreground">
                Ou descreva abaixo o que a pessoa disse:
              </p>
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={4}
                placeholder="Ex.: 'Mãe, mudei de número e preciso de PIX urgente...'"
                className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
              />
            </div>
          ) : tipo === "link" || tipo === "site" ? (
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholders[tipo]}
              inputMode="url"
              className="w-full rounded-2xl border border-border bg-background px-5 py-5 text-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
            />
          ) : (
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={7}
              placeholder={placeholders[tipo]}
              className="w-full resize-none rounded-2xl border border-border bg-background px-5 py-4 text-lg leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
            />
          )}

          <button
            onClick={run}
            disabled={loading || !value.trim()}
            className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-hero px-6 py-5 text-lg font-bold text-primary-foreground shadow-soft transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="size-5 animate-spin" /> Analisando com IA...</>
            ) : (
              <><Sparkles className="size-5" /> Analisar agora <ArrowRight className="size-5" /></>
            )}
          </button>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Não armazenamos o conteúdo. Tudo é analisado para sua proteção.
          </p>
        </div>

        {/* Result */}
        {result && (
          <ResultCard result={result} onReset={reset} onShare={share} />
        )}
      </div>
    </>
  );
}

function ResultCard({ result, onReset, onShare }: { result: AnalysisResult; onReset: () => void; onShare: () => void }) {
  const Icon = result.level === "safe" ? CheckCircle2 : result.level === "warn" ? AlertTriangle : ShieldAlert;
  const styles = {
    safe: { badge: "bg-safe-soft text-safe", dot: "bg-safe", panel: "bg-safe-soft", panelLabel: "text-safe", label: "Parece seguro" },
    warn: { badge: "bg-warn-soft text-warn-foreground", dot: "bg-warn", panel: "bg-warn-soft", panelLabel: "text-warn-foreground", label: "Atenção" },
    danger: { badge: "bg-danger-soft text-danger", dot: "bg-danger", panel: "bg-danger-soft", panelLabel: "text-danger", label: "Perigoso" },
  }[result.level];
  return (
    <div className="mt-10 animate-float-up rounded-[2rem] border border-border bg-card p-6 shadow-soft sm:p-10">
      <div className="grid items-center gap-8 sm:grid-cols-[auto_1fr]">
        <div className="mx-auto sm:mx-0">
          <RiskMeter score={result.score} level={result.level} />
        </div>
        <div>
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${styles.badge}`}>
            <Icon className="size-4" />
            {styles.label}
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            {result.headline}
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{result.summary}</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-secondary/60 p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold text-foreground">Por que esse alerta?</h3>
        <ul className="mt-3 space-y-2.5">
          {result.reasons.map((r, i) => (
            <li key={i} className="flex gap-3 text-base text-foreground/80">
              <span className={`mt-1 inline-block size-2 shrink-0 rounded-full ${styles.dot}`} />
              {r}
            </li>
          ))}
        </ul>
      </div>

      <div className={`mt-5 rounded-2xl p-5 sm:p-6 ${styles.panel}`}>
        <p className={`text-sm font-bold uppercase tracking-wider ${styles.panelLabel}`}>O que fazer agora</p>
        <p className="mt-2 text-lg font-semibold leading-snug text-foreground">{result.recommendation}</p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onReset}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-lg font-bold text-primary-foreground shadow-card transition-transform hover:scale-[1.01]"
        >
          <CheckCircle2 className="size-5" /> Entendi
        </button>
        <button
          onClick={onShare}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-border bg-card px-6 py-4 text-lg font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Share2 className="size-5" /> Compartilhar alerta
        </button>
      </div>
    </div>
  );
}