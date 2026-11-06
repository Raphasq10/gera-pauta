import Stripe from "stripe";

/**
 * ============================================================================
 * CLIENTE OFICIAL STRIPE & UTILITÁRIOS (FEATURE 6)
 * ============================================================================
 * 
 * Conecta com a API da Stripe de forma resiliente.
 * Se as variáveis de ambiente não estiverem configuradas, ativa automaticamente
 * o modo Sandbox de desenvolvimento transparente.
 */

/**
 * Obtém o cliente Stripe dinamicamente em tempo de execução
 */
export function getStripe(): Stripe | null {
  const secretKey = (process.env.STRIPE_SECRET_KEY || "").trim();
  if (!secretKey || !secretKey.startsWith("sk_")) {
    return null;
  }

  return new Stripe(secretKey, {
    appInfo: {
      name: "Gera Pauta AI",
      version: "1.0.0"
    }
  });
}

export const stripe = getStripe();

/**
 * Verifica se a Stripe está configurada com chave real no ambiente
 */
export function isStripeConfigured(): boolean {
  const secretKey = (process.env.STRIPE_SECRET_KEY || "").trim();
  return Boolean(secretKey && secretKey.startsWith("sk_"));
}

/**
 * Formata valores monetários para o padrão brasileiro (BRL)
 */
export function formatBRL(amountInCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(amountInCents / 100);
}

// Configuração dos planos comerciais do PRD
export const PLAN_CONFIG = {
  pro_monthly: {
    id: "pro_monthly",
    name: "Plano PRO Mensal",
    priceInCents: 4700, // R$ 47,00
    interval: "month" as const,
    description: "Pautas ilimitadas, todos os canais e suporte prioritário."
  },
  pro_annual: {
    id: "pro_annual",
    name: "Plano PRO Anual",
    priceInCents: 46800, // R$ 39,00/mês (R$ 468,00/ano)
    interval: "year" as const,
    description: "Economize 17% com faturamento anual e acesso imediato a todas as novidades."
  }
};
