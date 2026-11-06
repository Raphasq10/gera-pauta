import { z } from "zod";

/**
 * ============================================================================
 * SCHEMAS DE VALIDAÇÃO ZOD PARA AUTENTICAÇÃO (CLIENTE & SERVIDOR)
 * ============================================================================
 * 
 * Por que usar Zod?
 * 1. Sanitização: .trim() remove espaços acidentais antes e depois;
 *                 .toLowerCase() garante que 'User@Email.com' seja igual a 'user@email.com'.
 * 2. Segurança: Limita o tamanho máximo de caracteres contra ataques de negação de serviço (DoS).
 * 3. UX (Experiência do Usuário): Mensagens amigáveis em português antes mesmo de enviar ao backend.
 */

// Validador reutilizável de e-mail com sanitização
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "O e-mail é obrigatório.")
  .min(3, "O e-mail deve ter pelo menos 3 caracteres.")
  .max(255, "O e-mail não pode ultrapassar 255 caracteres.")
  .email("Formato de e-mail inválido. Ex: nome@empresa.com");

// Validador de senha com tamanho mínimo e máximo
export const passwordSchema = z
  .string()
  .min(1, "A senha é obrigatória.")
  .min(6, "A senha deve ter no mínimo 6 caracteres.")
  .max(100, "A senha não pode ultrapassar 100 caracteres.");

// Schema para Login (E-mail + Senha)
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;

// Schema para Cadastro (Nome da Empresa opcional + E-mail + Senha)
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  companyName: z
    .string()
    .trim()
    .max(100, "O nome não pode ultrapassar 100 caracteres.")
    .optional()
    .or(z.literal("")),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

// Schema para Recuperação de Senha (apenas e-mail)
export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Schema para Atualização de Senha
export const updatePasswordSchema = z.object({
  password: passwordSchema,
});

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

/**
 * Função utilitária para mascarar e-mails em logs (Segurança / LGPD)
 * Exemplo: 'raphael@empresa.com' vira 'r***l@empresa.com'
 */
export function maskEmail(email: string): string {
  try {
    const [user, domain] = email.split("@");
    if (!domain) return "***";
    const maskedUser = user.length > 2 
      ? `${user[0]}***${user[user.length - 1]}`
      : `${user[0]}***`;
    return `${maskedUser}@${domain}`;
  } catch {
    return "***@masked";
  }
}
