import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MessageSquareText,
  Link2,
  Mic,
  Globe,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Não Cai Nessa — Descubra se é golpe em segundos" },
      { name: "description", content: "Cole uma mensagem, link ou áudio e descubra na hora se pode ser golpe. Gratuito e feito para todos." },
      { property: "og:title", content: "Não Cai Nessa" },
      { property: "og:description", content: "Descubra se é golpe em segundos." },
    ],
  }),
  component: Index,
});

const actions = [
  { tipo: "texto" as const, label: "Analisar Mensagem", desc: "Cole o texto recebido", icon: MessageSquareText, primary: true },
  { tipo: "link" as const, label: "Analisar Link", desc: "Verifique antes de clicar", icon: Link2 },
  { tipo: "audio" as const, label: "Enviar Áudio", desc: "Áudio do WhatsApp", icon: Mic },
  { tipo: "site" as const, label: "Verificar Site", desc: "Endereço completo do site", icon: Globe },
];

const scams = [
  { title: "Golpe do PIX", desc: "Pedidos urgentes de transferência por mensagens.", tip: "Confirme sempre por telefone.", tone: "danger" as const },
  { title: "Falso Banco", desc: "Ligações pedindo senha ou código.", tip: "Nenhum banco pede sua senha.", tone: "danger" as const },
  { title: "Falso Boleto", desc: "Boletos alterados ou vencidos por e-mail.", tip: "Confira o beneficiário antes de pagar.", tone: "warn" as const },
  { title: "Troca de número no WhatsApp", desc: "Alguém finge ser parente pedindo dinheiro.", tip: "Ligue para o número antigo.", tone: "warn" as const },
];

function Index() {
  return (
    <>
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
        <div className="absolute -right-32 -top-32 size-[420px] rounded-full bg-white/10 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-20 size-[420px] rounded-full bg-white/10 blur-3xl" aria-hidden />

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-16 sm:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div className="text-primary-foreground animate-float-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur">
                <Sparkles className="size-4" /> IA contra golpes digitais
              </span>
              <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
                Descubra se é golpe<br />em segundos.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-white/85 sm:text-xl">
                Cole uma mensagem, link ou áudio suspeito. Nossa inteligência artificial avisa
                se parece seguro ou se é cilada.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/analise"
                  search={{ tipo: "texto" }}
                  className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-lg font-bold text-primary shadow-soft transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
                >
                  Analisar agora
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/aprenda"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-4 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
                >
                  Aprender a se proteger
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2"><ShieldCheck className="size-4" /> Gratuito</div>
                <div className="flex items-center gap-2"><ShieldCheck className="size-4" /> Sem cadastro</div>
                <div className="flex items-center gap-2"><ShieldCheck className="size-4" /> Funciona no celular</div>
              </div>
            </div>

            <div className="relative animate-float-up">
              <div className="rounded-[2rem] bg-white p-6 shadow-soft sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-danger-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-danger">
                    Cuidado, pode ser golpe
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">há 1 minuto</span>
                </div>
                <p className="mt-5 text-lg font-semibold leading-snug text-foreground">
                  “Mãe, mudei de número. Preciso de R$ 850 hoje no PIX, depois te explico.”
                </p>
                <div className="mt-6 grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border border-border bg-secondary px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Risco de golpe</p>
                    <p className="text-xs text-muted-foreground">Pedido urgente + troca de número</p>
                  </div>
                  <span className="font-display text-3xl font-extrabold text-danger tabular-nums">85%</span>
                </div>
                <ul className="mt-5 space-y-2.5 text-sm text-foreground/80">
                  <li className="flex gap-2"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" /> Pedido urgente de dinheiro.</li>
                  <li className="flex gap-2"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" /> Número diferente do conhecido.</li>
                  <li className="flex gap-2"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" /> Não envie dinheiro antes de confirmar.</li>
                </ul>
              </div>
              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-safe px-5 py-4 text-safe-foreground shadow-card sm:block">
                <p className="text-xs font-semibold uppercase tracking-wider opacity-90">Recomendação</p>
                <p className="text-sm font-semibold">Ligue para o número antigo antes de pagar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            O que você quer analisar?
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Escolha uma opção abaixo. É rápido e simples.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {actions.map((a) => (
            <Link
              key={a.label}
              to="/analise"
              search={{ tipo: a.tipo }}
              className={`group flex items-center gap-5 rounded-3xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft sm:p-7 ${
                a.primary ? "ring-2 ring-primary/20" : ""
              }`}
            >
              <div className={`grid size-16 shrink-0 place-items-center rounded-2xl ${a.primary ? "bg-gradient-hero text-primary-foreground" : "bg-primary-soft text-primary"}`}>
                <a.icon className="size-7" strokeWidth={2.2} />
              </div>
              <div className="flex-1">
                <p className="font-display text-xl font-bold text-foreground">{a.label}</p>
                <p className="mt-1 text-base text-muted-foreground">{a.desc}</p>
              </div>
              <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-danger-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-danger">
                <AlertTriangle className="size-3.5" /> Alerta
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                Golpes mais comuns hoje
              </h2>
              <p className="mt-2 text-base text-muted-foreground">Aprenda a reconhecer e proteja sua família.</p>
            </div>
            <Link to="/aprenda" className="text-sm font-bold text-primary hover:underline">
              Ver todos
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {scams.map((s) => (
              <article key={s.title} className="group flex flex-col rounded-3xl border border-border bg-card p-6 shadow-card transition-transform hover:-translate-y-1">
                <div className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${s.tone === "danger" ? "bg-danger-soft text-danger" : "bg-warn-soft text-warn-foreground"}`}>
                  {s.tone === "danger" ? "Perigoso" : "Atenção"}
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 flex-1 text-base text-muted-foreground">{s.desc}</p>
                <div className="mt-5 rounded-2xl bg-primary-soft px-4 py-3 text-sm font-semibold text-primary">
                  {s.tip}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-hero p-10 text-primary-foreground shadow-soft sm:p-14">
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-white/10 blur-3xl" aria-hidden />
          <div className="relative grid items-center gap-8 sm:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
                Na dúvida, não envie dinheiro.<br />Analise antes.
              </h2>
              <p className="mt-4 text-lg text-white/85">
                Em poucos segundos você descobre se a mensagem é confiável.
              </p>
            </div>
            <Link
              to="/analise"
              search={{ tipo: "texto" }}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-5 text-lg font-bold text-primary shadow-soft transition-transform hover:scale-[1.02]"
            >
              Analisar agora
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} Não Cai Nessa. Feito para proteger quem você ama.</p>
        </div>
      </footer>
    </>
  );
}