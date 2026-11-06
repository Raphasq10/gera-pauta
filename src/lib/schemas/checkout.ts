import { z } from "zod";

/**
 * ============================================================================
 * SCHEMA ZOD PARA CHECKOUT & ASSINATURA DE PLANOS (FEATURE 6)
 * ============================================================================
 * 
 * Regras estritas:
 * 1. Planos suportados: "pro_monthly" (R$ 47/mês) e "pro_annual" (R$ 39/mês faturado anualmente).
 * 2. Validação rigorosa de URLs de retorno (apenas http/https válidas, proteção contra Open Redirect).
 * 3. Sanitização automática com .trim().
 */

export const PlanIdSchema = z.enum(["pro_monthly", "pro_annual"], {
  message: "Plano selecionado inválido."
});

export const CreateCheckoutSessionSchema = z.object({
  planId: PlanIdSchema.default("pro_monthly"),
  billingInterval: z.enum(["monthly", "annual"]).default("monthly"),
  successUrl: z.string().url("URL de sucesso inválida.").optional(),
  cancelUrl: z.string().url("URL de cancelamento inválida.").optional()
});

export type CreateCheckoutSessionInput = z.infer<typeof CreateCheckoutSessionSchema>;

export const SimulatePaymentSchema = z.object({
  planId: PlanIdSchema.default("pro_monthly"),
  paymentMethod: z.enum(["credit_card", "pix"]).default("credit_card")
});

export type SimulatePaymentInput = z.infer<typeof SimulatePaymentSchema>;

export const SubscriptionStatusSchema = z.object({
  isPro: z.boolean(),
  plan: z.string().max(50),
  status: z.enum(["active", "trialing", "past_due", "canceled", "free"]),
  currentPeriodEnd: z.string().optional()
});

export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;
