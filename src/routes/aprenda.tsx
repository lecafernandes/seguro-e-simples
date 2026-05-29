import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Phone, Eye, Lock, Users, AlertTriangle } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/aprenda")({
  head: () => ({
    meta: [
      { title: "Aprenda a se proteger — Não Cai Nessa" },
      { name: "description", content: "Dicas simples e visuais para evitar golpes em mensagens, ligações, links e pagamentos." },
    ],
  }),
  component: Aprenda,
});

const tips = [
  { icon: Phone, title: "Ligue antes de pagar", desc: "Sempre confirme por uma ligação para o número que você já conhece, nunca pelo número novo recebido." },
  { icon: Lock, title: "Nunca compartilhe códigos", desc: "Bancos, lojas e correios nunca pedem código por mensagem. Se pedirem, é golpe." },
  { icon: Eye, title: "Olhe o endereço do link", desc: "Sites de banco terminam em .com.br oficial. Desconfie de .xyz, .top e encurtadores." },
  { icon: Users, title: "Converse com a família", desc: "Combine uma palavra de segurança com filhos e netos para confirmar pedidos urgentes." },
  { icon: ShieldCheck, title: "Desconfie da pressa", desc: "Golpistas usam urgência para você não pensar. Respire e analise com calma." },
  { icon: AlertTriangle, title: "Não envie dinheiro antes de confirmar", desc: "Em caso de dúvida, espere. Se for verdade, a pessoa entenderá." },
];

export default function Aprenda() { return <Page />; }
function Page() {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-5 pb-24 pt-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" /> Voltar
        </Link>

        <header className="mt-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-safe-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-safe">
            <ShieldCheck className="size-3.5" /> Proteção
          </span>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground sm:text-5xl">
            Aprenda a se proteger.
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Seis dicas simples para você e sua família nunca caírem em golpe.
          </p>
        </header>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {tips.map((t, i) => (
            <article key={t.title} className="flex gap-5 rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                <t.icon className="size-6" strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dica {i + 1}</p>
                <h2 className="mt-1 font-display text-xl font-bold text-foreground">{t.title}</h2>
                <p className="mt-2 text-base text-muted-foreground">{t.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] bg-gradient-hero p-8 text-primary-foreground shadow-soft sm:p-10">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Recebeu algo suspeito?</h2>
          <p className="mt-3 text-white/85">Analise agora mesmo. É rápido e gratuito.</p>
          <Link
            to="/analise"
            search={{ tipo: "texto" }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-bold text-primary shadow-card transition-transform hover:scale-[1.02]"
          >
            Analisar agora
          </Link>
        </div>
      </div>
    </>
  );
}