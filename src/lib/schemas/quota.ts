import { z } from "zod";

/**
 * ============================================================================
 * SCHEMA ZOD PARA CONTROLE DE QUOTA & LIMITES DE DEGUSTAÇÃO (FEATURE 4)
 * ============================================================================
 * 
 * Centraliza as regras de negócio de gratuidade:
 * - Limite padrão de 5 pautas no plano gratuito.
 * - Validação de payloads de consulta e reset de quota.
 */

export const MAX_FREE_PITCHES = 5;

// Schema para resposta do status de quota
export const QuotaStatusSchema = z.object({
  usedPitches: z.number().int().min(0),
  maxFreePitches: z.number().int().default(MAX_FREE_PITCHES),
  isPro: z.boolean().default(false),
  hasByok: z.boolean().default(false),
  canGenerate: z.boolean(),
  remainingPitches: z.number().int().min(0)
});

export type QuotaStatus = z.infer<typeof QuotaStatusSchema>;

// Schema para requisição de reset de quota (ambiente de testes/dev)
export const ResetQuotaRequestSchema = z.object({
  reason: z
    .string()
    .trim()
    .max(200, "O motivo não pode ultrapassar 200 caracteres.")
    .optional()
    .default("manual_dev_reset")
});

export type ResetQuotaRequest = z.infer<typeof ResetQuotaRequestSchema>;
