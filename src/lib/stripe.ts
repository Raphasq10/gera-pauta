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

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-01-27.acacia" as any,
      appInfo: {
        name: "Gera Pauta AI",
        version: "1.0.0"
      }
    })
  : null;

/**
 * Verifica se a Stripe está configurada com chave real no ambiente
 */
export function isStripeConfigured(): boolean {
  return Boolean(stripe && stripeSecretKey.trim().startsWith("sk_"));
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
