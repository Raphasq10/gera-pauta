import { z } from "zod";

/**
 * ============================================================================
 * SCHEMA ZOD PARA ONBOARDING DE CONTEXTO DO NEGÓCIO (FEATURE 2)
 * ============================================================================
 * 
 * Este schema define com rigor os dados permitidos para cadastrar ou editar
 * a memória de marca do cliente.
 * 
 * Regras aplicadas:
 * 1. Sanitização com .trim() para limpar espaços em branco desnecessários.
 * 2. Limites estritos de tamanho (min/max) para proteger o banco de dados.
 * 3. Mensagens de erro amigáveis em português para a interface do usuário.
 */

export const businessProfileSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "O nome da empresa deve ter pelo menos 2 caracteres.")
    .max(100, "O nome da empresa não pode ultrapassar 100 caracteres."),
  
  niche: z
    .string()
    .trim()
    .min(2, "O nicho de atuação deve ter pelo menos 2 caracteres.")
    .max(100, "O nicho não pode ultrapassar 100 caracteres."),
  
  toneOfVoice: z
    .string()
    .trim()
    .min(2, "O tom de voz deve ter pelo menos 2 caracteres.")
    .max(150, "O tom de voz não pode ultrapassar 150 caracteres."),
  
  targetAudience: z
    .string()
    .trim()
    .min(3, "Descreva o público-alvo com pelo menos 3 caracteres.")
    .max(300, "A descrição do público não pode ultrapassar 300 caracteres."),
  
  keyPain: z
    .string()
    .trim()
    .min(5, "A dor ou objeção principal deve ter pelo menos 5 caracteres.")
    .max(500, "A dor principal não pode ultrapassar 500 caracteres."),
  
  differential: z
    .string()
    .trim()
    .min(5, "O diferencial competitivo deve ter pelo menos 5 caracteres.")
    .max(500, "O diferencial não pode ultrapassar 500 caracteres."),
  
  mainProduct: z.string().trim().max(300).optional(),
  forbiddenWords: z.string().trim().max(500).optional(),
  customPersonas: z.any().optional(),
});

export type BusinessProfileInput = z.infer<typeof businessProfileSchema>;
