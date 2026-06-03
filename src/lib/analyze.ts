export type Level = "safe" | "warn" | "danger";

export type AnalysisResult = {
  score: number;
  level: Level;
  headline: string;
  summary: string;
  reasons: string[];
  recommendation: string;
};

const dangerPatterns = [
  { pattern: /pix\s*(urgente|agora|hoje|r\$|reais)/i, reason: "Pedido urgente de PIX — sinal clássico de golpe." },
  { pattern: /(mudei|novo|meu)\s*(de\s*)?n[úu]mero/i, reason: "Troca de número suspeita — golpistas trocam contato para enganar." },
  { pattern: /(c[óo]digo|senha|token).{0,30}(banco|cart[ãa]o|pix|whatsapp)/i, reason: "Pedido de código ou senha — nenhuma instituição séria faz isso." },
  { pattern: /(conta|cart[ãa]o).{0,20}(bloquead|suspens|cancelad)/i, reason: "Alerta de bloqueio de conta — tática comum para criar pânico." },
  { pattern: /clique.{0,20}(link|aqui|bot[ãa]o).{0,20}(confirm|atualiz|verific)/i, reason: "Link pedindo confirmação de dados — não clique." },
  { pattern: /(receita federal|serasa|spc).{0,40}(d[íi]vida|irregular|pendência|processo)/i, reason: "Ameaça de órgão oficial — receita e serasa não avisam por WhatsApp." },
  { pattern: /(prêmio|ganhador|sorteio|contemplad).{0,30}(pix|taxa|liberar|retirar)/i, reason: "Prêmio que pede pagamento para receber — golpe clássico." },
  { pattern: /atualize?\s*(seus\s*)?dados/i, reason: "Pedido de atualização de dados por mensagem — é golpe." },
  { pattern: /(boleto|cobran[çc]a).{0,30}(vencid|atrasad|pendente)/i, reason: "Cobrança por mensagem com urgência — confirme direto com a empresa." },
  { pattern: /(m[ãa]e|pai|filho|filha|v[óo]|av[óo]).{0,30}(pix|transfer|dinheiro|r\$)/i, reason: "Familiar pedindo dinheiro por mensagem — ligue antes de pagar." },
];

const warnWords = [
  { word: "urgente", reason: "Uso de urgência para pressionar." },
  { word: "imediatamente", reason: "Pressão de tempo — tática de golpistas." },
  { word: "promoção exclusiva", reason: "Oferta exclusiva por mensagem — desconfie." },
  { word: "grátis", reason: "Promessa de gratuidade suspeita." },
  { word: "sorteio", reason: "Menção a sorteio pode ser isca." },
  { word: "verifique sua conta", reason: "Pedido de verificação de conta." },
  { word: "confirme seus dados", reason: "Pedido de confirmação de dados pessoais." },
];

const suspiciousDomains = [".xyz", ".top", ".click", ".tk", "bit.ly", "encurtador", "tinyurl", "cutt.ly", "is.gd"];
const trustedDomains = ["gov.br", "com.br", "org.br", "edu.br", "nubank.com.br", "itau.com.br", "bradesco.com.br", "santander.com.br", "bb.com.br", "caixa.gov.br"];

export function analyzeText(input: string): AnalysisResult {
  const text = input.trim();
  if (!text) {
    return {
      score: 0,
      level: "safe",
      headline: "Sem conteúdo",
      summary: "Cole uma mensagem para analisar.",
      reasons: [],
      recommendation: "Cole o texto suspeito no campo acima.",
    };
  }

  let score = 0;
  const reasons: string[] = [];

  for (const { pattern, reason } of dangerPatterns) {
    if (pattern.test(text)) {
      score += 30;
      reasons.push(reason);
    }
  }

  const lowerText = text.toLowerCase();
  for (const { word, reason } of warnWords) {
    if (lowerText.includes(word)) {
      score += 10;
      reasons.push(reason);
    }
  }

  const linkMatch = text.match(/https?:\/\/[^\s]+/g);
  if (linkMatch) {
    for (const link of linkMatch) {
      const lowerLink = link.toLowerCase();
      const isTrusted = trustedDomains.some((d) => lowerLink.includes(d));
      const isSuspicious = suspiciousDomains.some((d) => lowerLink.includes(d));
      if (isSuspicious) {
        score += 35;
        reasons.push(`Link com domínio suspeito: ${link}`);
      } else if (!isTrusted) {
        score += 8;
        reasons.push(`Mensagem contém link — confirme antes de clicar.`);
      }
    }
  }

  if (/r\$\s*\d+|\d+\s*reais/i.test(text) && /pix|transfer|deposita|manda/i.test(text)) {
    score += 20;
    reasons.push("Pedido de transferência com valor específico.");
  }

  if ((text.match(/!/g) || []).length >= 3) {
    score += 8;
    reasons.push("Muitas exclamações — tática para criar urgência emocional.");
  }

  score = Math.min(99, score);
  if (reasons.length === 0) {
    reasons.push("Não encontramos sinais comuns de golpe nesta mensagem.");
  }

  let level: Level = "safe";
  let headline = "Isso parece seguro";
  let summary = "Não vimos sinais claros de golpe. Mas fique sempre atento e nunca envie dinheiro sem confirmar pessoalmente.";
  let recommendation = "Pode prosseguir com calma. Em caso de dúvida, ligue para a pessoa pelo número que você já conhece.";

  if (score >= 55) {
    level = "danger";
    headline = "Cuidado, pode ser golpe";
    summary = "Essa mensagem tem várias marcas típicas de golpe. Não envie dinheiro nem clique em links.";
    recommendation = "Não responda, não clique e ligue para alguém de confiança antes de qualquer ação.";
  } else if (score >= 25) {
    level = "warn";
    headline = "Mensagem suspeita";
    summary = "Alguns sinais pedem atenção. Confirme com a pessoa ou empresa por outro canal antes de agir.";
    recommendation = "Não envie dinheiro antes de confirmar. Ligue para a pessoa pelo número que você já conhece.";
  }

  return { score, level, headline, summary, reasons: reasons.slice(0, 5), recommendation };
}

export function analyzeLink(url: string): AnalysisResult {
  const u = url.trim();
  const lowerU = u.toLowerCase();
  let score = 0;
  const reasons: string[] = [];

  if (!/^https?:\/\//i.test(u)) {
    score += 20;
    reasons.push("O endereço não começa com https:// — sites confiáveis usam HTTPS.");
  }

  const isTrusted = trustedDomains.some((d) => lowerU.includes(d));
  if (isTrusted) {
    score = Math.max(0, score - 10);
    reasons.push("Domínio reconhecido como confiável.");
  }

  if (suspiciousDomains.some((d) => lowerU.includes(d))) {
    score += 45;
    reasons.push("Domínio encurtador ou de baixa reputação — pode esconder destino real.");
  }

  if (/(banco|caixa|nubank|inter|bradesco|itau|santander|pix|gov)\.(xyz|top|click|info|site|tk)/i.test(lowerU)) {
    score += 50;
    reasons.push("Imita nome de banco ou governo em domínio estranho — fortíssimo sinal de golpe.");
  }

  if (/(nubank|itau|bradesco|santander|caixa|inter|bb|gov)[-.](?!com\.br|gov\.br)/i.test(lowerU)) {
    score += 35;
    reasons.push("Imita nome de instituição conhecida com domínio diferente do oficial.");
  }

  if (u.length > 100) {
    score += 10;
    reasons.push("Endereço muito longo — costuma esconder o destino real.");
  }

  if (/-{2,}|\d{5,}/.test(lowerU)) {
    score += 8;
    reasons.push("Sequência incomum de números ou traços no endereço.");
  }

  if (reasons.length === 0) reasons.push("Estrutura do link parece normal.");

  score = Math.min(99, score);
  return shape(score, reasons, {
    safeHead: "Esse link parece seguro",
    warnHead: "Esse link é suspeito",
    dangerHead: "Não clique nesse link",
  });
}

function shape(
  score: number,
  reasons: string[],
  heads: { safeHead: string; warnHead: string; dangerHead: string },
): AnalysisResult {
  if (score >= 55) {
    return {
      score,
      level: "danger",
      headline: heads.dangerHead,
      summary: "Esse conteúdo tem sinais fortes de fraude. Evite qualquer interação.",
      reasons,
      recommendation: "Apague a mensagem e bloqueie o remetente. Em dúvida, peça ajuda a um familiar.",
    };
  }
  if (score >= 25) {
    return {
      score,
      level: "warn",
      headline: heads.warnHead,
      summary: "Alguns sinais pedem cautela. Confirme antes de avançar.",
      reasons,
      recommendation: "Confirme por telefone ou pessoalmente antes de continuar.",
    };
  }
  return {
    score,
    level: "safe",
    headline: heads.safeHead,
    summary: "Não encontramos sinais claros de fraude. Ainda assim, fique atento.",
    reasons,
    recommendation: "Pode prosseguir com calma. Nunca compartilhe senhas ou códigos.",
  };
}
