import { z } from "zod";

/**
 * ============================================================================
 * SCHEMA ZOD PARA CHAVE DE IA DO USUÁRIO (BYOK - FEATURE 5)
 * ============================================================================
 * 
 * Regras estritas:
 * 1. Chave de API deve ter entre 15 e 150 caracteres.
 * 2. Formato alfanumérico com caracteres válidos de API keys (letras, números, hífens, underlines).
 * 3. Sanitização automática com .trim().
 */

export const ApiKeySchema = z
  .string()
  .trim()
  .min(15, "A chave de API deve ter pelo menos 15 caracteres.")
  .max(150, "A chave de API não pode ultrapassar 150 caracteres.")
  .regex(
    /^[A-Za-z0-9_-]+$/,
    "Formato de chave inválido. A chave do Google Gemini contém apenas letras, números, hífens e underlines."
  );

export const SaveApiKeySchema = z.object({
  apiKey: ApiKeySchema,
  provider: z.enum(["gemini", "openai"]).default("gemini")
});

export type SaveApiKeyInput = z.infer<typeof SaveApiKeySchema>;

export const TestApiKeySchema = z.object({
  apiKey: ApiKeySchema,
  provider: z.enum(["gemini", "openai"]).default("gemini")
});

export type TestApiKeyInput = z.infer<typeof TestApiKeySchema>;

/**
 * Função utilitária para mascarar a chave e nunca vazar dados sensíveis nos logs ou UI
 * Exemplo: AIzaSyD3249abcdef1234 -> AIzaSy...1234
 */
export function maskApiKey(key: string): string {
  if (!key || key.length < 10) return "••••••••";
  const start = key.slice(0, 6);
  const end = key.slice(-4);
  return `${start}...${end}`;
}
