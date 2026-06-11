export type Level = "safe" | "warn" | "danger";

export type AnalysisResult = {
  score: number;
  level: Level;
  headline: string;
  summary: string;
  reasons: string[];
  recommendation: string;
};

// ─── PADRÕES DE GOLPE (combinações de palavras) ───────────────────────────────

const dangerPatterns = [
  { pattern: /pix.{0,30}(urgente|agora|hoje|r\$|\d+)/i, reason: "Pedido urgente de PIX — sinal clássico de golpe." },
  { pattern: /(mudei|novo|meu).{0,10}n[úu]mero/i, reason: "Troca de número suspeita — golpistas trocam contato para enganar." },
  { pattern: /(c[óo]digo|senha|token).{0,40}(banco|cart[ãa]o|pix|whatsapp|acesso)/i, reason: "Pedido de código ou senha — nenhuma instituição séria faz isso por mensagem." },
  { pattern: /(conta|cart[ãa]o).{0,30}(bloquead|suspens|cancelad)/i, reason: "Alerta de bloqueio de conta — tática para criar pânico e te apressar." },
  { pattern: /clique.{0,30}(link|aqui|bot[ãa]o).{0,30}(confirm|atualiz|verific)/i, reason: "Link pedindo confirmação de dados — não clique." },
  { pattern: /(receita federal|serasa|spc|tribunal|juiz).{0,50}(d[íi]vida|irregular|pendência|processo|multa)/i, reason: "Ameaça de órgão oficial — esses órgãos não avisam por WhatsApp ou SMS." },
  { pattern: /(prêmio|ganhador|sorteio|contemplad|selecionado).{0,40}(pix|taxa|liberar|retirar|pagar|depósito)/i, reason: "Prêmio que pede pagamento para receber — golpe clássico." },
  { pattern: /atualize?\s*(seus\s*)?dados/i, reason: "Pedido de atualização de dados por mensagem — é golpe." },
  { pattern: /(boleto|cobran[çc]a|fatura).{0,40}(vencid|atrasad|pendente).{0,40}(clique|acesse|pague)/i, reason: "Cobrança urgente com link — confirme direto com a empresa pelo site oficial." },
  { pattern: /(m[ãa]e|pai|filho|filha|v[óo]|av[óo]|mano|irmã).{0,40}(pix|transfer|dinheiro|r\$|\d{3,})/i, reason: "Familiar pedindo dinheiro por mensagem — ligue para confirmar antes de pagar." },
  { pattern: /(banco|gerente|atendente).{0,40}(liga|ligando|ligar|falar).{0,40}(cart[ãa]o|senha|fraude)/i, reason: "Falso gerente de banco pedindo dados — bancos nunca fazem isso por ligação." },
  { pattern: /(entrega|correio|sedex|encomenda).{0,40}(taxa|pagar|liberar|clique)/i, reason: "Falsa cobrança de entrega — golpe muito comum por SMS." },
];

const warnPatterns = [
  { pattern: /promoção.{0,20}(exclusiva|limitada|hoje|agora)/i, reason: "Oferta com prazo urgente — desconfie de promoções que pressionam." },
  { pattern: /grátis.{0,20}(clique|acesse|cadastre)/i, reason: "Promessa de gratuidade pedindo ação — pode ser isca." },
  { pattern: /você foi selecionado/i, reason: "Mensagem de 'selecionado' sem contexto — sinal de alerta." },
  { pattern: /confirme (seus dados|sua identidade|seu cadastro)/i, reason: "Pedido de confirmação de dados — verifique a origem." },
  { pattern: /acesse (agora|já|imediatamente)/i, reason: "Pressão para acessar algo imediatamente — tática de golpistas." },
  { pattern: /\burgente\b/i, reason: "Palavra 'urgente' — usada para te apressar e impedir que você pense." },
];

const suspiciousDomains = [".xyz", ".top", ".click", ".tk", ".ml", ".ga", ".cf", "bit.ly", "tinyurl", "cutt.ly", "encurtador", "is.gd", "gg.gg"];
const trustedDomains = ["gov.br", "nubank.com.br", "itau.com.br", "bradesco.com.br", "santander.com.br", "bb.com.br", "caixa.gov.br", "inter.co", "picpay.com", "mercadopago.com", "ifood.com.br", "amazon.com.br", "correios.com.br"];

// ─── ANÁLISE DE MENSAGEM / ÁUDIO ──────────────────────────────────────────────

export function analyzeText(input: string): AnalysisResult {
  const text = input.trim();
  if (!text || text.startsWith("Áudio:") && text.length < 30) {
    return {
      score: 0,
      level: "safe",
      headline: "Sem conteúdo para analisar",
      summary: "Descreva o que a pessoa disse no áudio para analisarmos.",
      reasons: ["Nenhum texto foi fornecido para análise."],
      recommendation: "Transcreva ou descreva o conteúdo do áudio no campo de texto abaixo.",
    };
  }

  let score = 0;
  const reasons: string[] = [];

  for (const { pattern, reason } of dangerPatterns) {
    if (pattern.test(text)) {
      score += 28;
      reasons.push(reason);
    }
  }

  for (const { pattern, reason } of warnPatterns) {
    if (pattern.test(text)) {
      score += 12;
      reasons.push(reason);
    }
  }

  const links = text.match(/https?:\/\/[^\s]+|www\.[^\s]+/gi);
  if (links) {
    for (const link of links) {
      const lower = link.toLowerCase();
      if (suspiciousDomains.some((d) => lower.includes(d))) {
        score += 30;
        reasons.push(`Link com domínio suspeito detectado — não clique.`);
      } else if (!trustedDomains.some((d) => lower.includes(d))) {
        score += 8;
        reasons.push("Mensagem contém link desconhecido — confirme antes de clicar.");
      }
    }
  }

  if (/r\$\s*\d+|\d+\s*reais/i.test(text) && /pix|transfere|deposita|manda|envia/i.test(text)) {
    score += 18;
    reasons.push("Pedido de transferência com valor específico — confirme pessoalmente.");
  }

  if ((text.match(/!/g) || []).length >= 3) {
    score += 6;
    reasons.push("Muitas exclamações — tática para criar urgência emocional.");
  }

  score = Math.min(99, score);
  if (reasons.length === 0) reasons.push("Não encontramos sinais comuns de golpe nesta mensagem.");

  return buildResult(score, reasons, {
    safeHead: "Essa mensagem parece segura",
    safeSummary: "Não encontramos sinais de golpe. Mesmo assim, nunca envie dinheiro sem confirmar pessoalmente.",
    safeRec: "Pode prosseguir com calma. Em caso de dúvida, ligue para a pessoa pelo número que você já conhece.",
    warnHead: "Mensagem suspeita",
    warnSummary: "Alguns sinais pedem atenção. Confirme com a pessoa por outro canal antes de agir.",
    warnRec: "Não envie dinheiro antes de confirmar. Ligue para a pessoa pelo número que você já conhece.",
    dangerHead: "Cuidado, pode ser golpe",
    dangerSummary: "Essa mensagem tem várias marcas típicas de golpe. Não envie dinheiro nem clique em links.",
    dangerRec: "Não responda, não clique e ligue para alguém de confiança antes de qualquer ação.",
  });
}

// ─── ANÁLISE DE LINK ──────────────────────────────────────────────────────────

export function analyzeLink(url: string): AnalysisResult {
  const raw = url.trim();
  if (!raw) {
    return {
      score: 0, level: "safe",
      headline: "Nenhum link informado",
      summary: "Cole um link para analisarmos.",
      reasons: ["Nenhum endereço foi fornecido."],
      recommendation: "Cole o link completo no campo acima.",
    };
  }

  const u = /^https?:\/\//i.test(raw) ? raw.toLowerCase() : `https://${raw}`.toLowerCase();
  let score = 0;
  const reasons: string[] = [];

  if (raw.startsWith("http://")) {
    score += 15;
    reasons.push("O link usa HTTP sem segurança — sites confiáveis usam HTTPS.");
  }

  const isTrusted = trustedDomains.some((d) => u.includes(d));
  if (isTrusted) {
    reasons.push("Domínio reconhecido como confiável.");
    score = Math.max(0, score);
  }

  if (suspiciousDomains.some((d) => u.includes(d))) {
    score += 45;
    reasons.push("Domínio encurtador ou de baixa reputação — pode esconder o destino real.");
  }

  if (/(nubank|itau|bradesco|santander|caixa|inter|bb|picpay|gov|receita|correios)[^/]*\.(xyz|top|click|info|site|tk|ml|ga)/i.test(u)) {
    score += 55;
    reasons.push("Imita nome de banco ou governo em domínio estranho — golpe de phishing.");
  }

  if (/(nubank|itau|bradesco|santander|caixa|inter|bb|picpay|gov|receita)[-.](?!(com\.br|gov\.br|co$))/i.test(u)) {
    score += 35;
    reasons.push("Imita nome de instituição conhecida com domínio diferente do oficial.");
  }

  if (raw.length > 100) {
    score += 10;
    reasons.push("Endereço muito longo — costuma esconder o destino real.");
  }

  if (/-{2,}|\d{5,}/.test(u)) {
    score += 8;
    reasons.push("Sequência incomum de números ou traços no endereço.");
  }

  if (reasons.length === 0) reasons.push("Estrutura do link parece normal.");

  score = Math.min(99, score);

  return buildResult(score, reasons, {
    safeHead: "Esse link parece seguro",
    safeSummary: "Não encontramos sinais de fraude neste endereço.",
    safeRec: "Pode acessar com calma. Nunca insira senha ou dados bancários em sites desconhecidos.",
    warnHead: "Esse link é suspeito",
    warnSummary: "Alguns sinais pedem atenção. Confirme se o endereço é realmente oficial.",
    warnRec: "Não insira dados pessoais. Acesse o site digitando o endereço oficial direto no navegador.",
    dangerHead: "Não clique nesse link",
    dangerSummary: "Esse link tem sinais fortes de fraude. Evite qualquer interação.",
    dangerRec: "Apague a mensagem e bloqueie o remetente. Em dúvida, peça ajuda a um familiar.",
  });
}

// ─── ANÁLISE DE ÁUDIO ─────────────────────────────────────────────────────────

export function analyzeAudio(transcription: string): AnalysisResult {
  const text = transcription.trim();

  if (!text || /^[Áá]udio:\s*.+\(\d+\s*KB\)$/.test(text)) {
    return {
      score: 0,
      level: "safe",
      headline: "Descreva o que ouviu",
      summary: "Não conseguimos analisar apenas o nome do arquivo. Escreva o que a pessoa falou no áudio.",
      reasons: ["Para analisar um áudio, transcreva ou resuma o que foi dito."],
      recommendation: "Use o campo de texto abaixo para descrever o conteúdo do áudio.",
    };
  }

  return analyzeText(text);
}

// ─── ANÁLISE DE SITE ──────────────────────────────────────────────────────────

export function analyzeSite(url: string): AnalysisResult {
  return analyzeLink(url);
}

// ─── HELPER ───────────────────────────────────────────────────────────────────

function buildResult(
  score: number,
  reasons: string[],
  msgs: {
    safeHead: string; safeSummary: string; safeRec: string;
    warnHead: string; warnSummary: string; warnRec: string;
    dangerHead: string; dangerSummary: string; dangerRec: string;
  }
): AnalysisResult {
  if (score >= 55) {
    return { score, level: "danger", headline: msgs.dangerHead, summary: msgs.dangerSummary, reasons: reasons.slice(0, 5), recommendation: msgs.dangerRec };
  }
  if (score >= 25) {
    return { score, level: "warn", headline: msgs.warnHead, summary: msgs.warnSummary, reasons: reasons.slice(0, 5), recommendation: msgs.warnRec };
  }
  return { score, level: "safe", headline: msgs.safeHead, summary: msgs.safeSummary, reasons: reasons.slice(0, 5), recommendation: msgs.safeRec };
}