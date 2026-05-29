export type Level = "safe" | "warn" | "danger";

export type AnalysisResult = {
  score: number;
  level: Level;
  headline: string;
  summary: string;
  reasons: string[];
  recommendation: string;
};

const dangerWords = [
  "pix urgente",
  "transfira",
  "deposite",
  "código de verificação",
  "cartão bloqueado",
  "conta bloqueada",
  "clique no link",
  "ganhador",
  "prêmio",
  "receita federal",
  "imposto",
  "atualize seus dados",
  "boleto vencido",
  "novo número",
  "mãe",
  "pai",
  "filho",
  "emergência",
  "agora",
  "imediatamente",
];

const warnWords = ["promoção", "oferta", "desconto", "limitado", "grátis", "sorteio", "verifique", "atualizar"];

const suspiciousDomains = [".xyz", ".top", ".click", ".tk", "bit.ly", "encurtador", "tinyurl"];

export function analyzeText(input: string): AnalysisResult {
  const text = input.toLowerCase().trim();
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

  let score = 5;
  const reasons: string[] = [];

  for (const w of dangerWords) {
    if (text.includes(w)) {
      score += 14;
      reasons.push(`Usa expressão típica de golpe: “${w}”.`);
    }
  }
  for (const w of warnWords) {
    if (text.includes(w)) {
      score += 6;
      reasons.push(`Palavra de pressão ou oferta: “${w}”.`);
    }
  }

  const linkMatch = text.match(/https?:\/\/[^\s]+/g);
  if (linkMatch) {
    score += 10;
    reasons.push(`Mensagem contém ${linkMatch.length} link(s). Confirme antes de clicar.`);
    for (const link of linkMatch) {
      if (suspiciousDomains.some((d) => link.includes(d))) {
        score += 25;
        reasons.push(`Link com endereço suspeito: ${link}.`);
      }
    }
  }

  if (/\b(r\$|reais)\b/.test(text) || /\d+([.,]\d+)?/.test(text)) {
    score += 6;
    reasons.push("Pede valores em dinheiro ou cita quantias.");
  }
  if (text.includes("!")) score += 3;
  if (text.length < 25) score += 4;

  score = Math.min(99, score);
  if (reasons.length === 0) {
    reasons.push("Não encontramos sinais comuns de golpe nesta mensagem.");
  }

  let level: Level = "safe";
  let headline = "Isso parece seguro";
  let summary = "Não vimos sinais claros de golpe. Mas siga atento e nunca envie dinheiro sem confirmar pessoalmente.";
  let recommendation = "Pode prosseguir com calma. Em caso de dúvida, ligue para a pessoa.";

  if (score >= 60) {
    level = "danger";
    headline = "Cuidado, pode ser golpe";
    summary = "Essa mensagem tem várias marcas típicas de golpe. Não envie dinheiro nem clique em links.";
    recommendation = "Não responda, não clique e ligue para alguém de confiança antes de qualquer ação.";
  } else if (score >= 30) {
    level = "warn";
    headline = "Mensagem suspeita";
    summary = "Alguns sinais pedem atenção. Confirme com a pessoa ou empresa por outro canal antes de agir.";
    recommendation = "Não envie dinheiro antes de confirmar. Ligue para a pessoa pelo número que você já conhece.";
  }

  return { score, level, headline, summary, reasons: reasons.slice(0, 5), recommendation };
}

export function analyzeLink(url: string): AnalysisResult {
  const u = url.trim().toLowerCase();
  let score = 10;
  const reasons: string[] = [];
  if (!/^https?:\/\//.test(u)) {
    score += 20;
    reasons.push("O endereço não começa com https://. Sites confiáveis usam HTTPS.");
  }
  if (suspiciousDomains.some((d) => u.includes(d))) {
    score += 45;
    reasons.push("Domínio é encurtador ou de baixa reputação.");
  }
  if (/(banco|caixa|nubank|inter|bradesco|itau|santander|pix).*\.(xyz|top|click|info|site)/.test(u)) {
    score += 40;
    reasons.push("Imita nome de banco em domínio estranho — fortíssimo sinal de golpe.");
  }
  if (u.length > 80) {
    score += 10;
    reasons.push("Endereço muito longo, costuma esconder destino real.");
  }
  if (/-{2,}|\d{4,}/.test(u)) {
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
  if (score >= 60) {
    return {
      score,
      level: "danger",
      headline: heads.dangerHead,
      summary: "Esse conteúdo tem sinais fortes de fraude. Evite qualquer interação.",
      reasons,
      recommendation: "Apague a mensagem e bloqueie o remetente. Em dúvida, peça ajuda a um familiar.",
    };
  }
  if (score >= 30) {
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