import crypto from "crypto";

/**
 * ============================================================================
 * UTILITÁRIO DE CRIPTOGRAFIA SIMÉTRICA (AES-256-CBC) - FEATURE 5
 * ============================================================================
 * 
 * Garante que chaves de API do usuário sejam salvas criptografadas no banco
 * e nunca em texto puro.
 */

// Gera uma chave segura de 32 bytes baseada no ambiente
const SECRET_SEED = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  "gera-pauta-ai-secure-encryption-seed-2026";

const KEY = crypto.createHash("sha256").update(SECRET_SEED).digest();
const IV_LENGTH = 16;

/**
 * Criptografa uma string em formato seguro iv:encryptedData
 */
export function encryptText(text: string): string {
  if (!text) return "";
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Descriptografa uma string criptografada no formato iv:encryptedData
 * Se a string não estiver criptografada (ex: chaves antigas de teste), retorna a chave direta com segurança.
 */
export function decryptText(cipherText: string): string {
  if (!cipherText) return "";
  // Se não contiver o separador de IV, assume chave pré-criptografia (retrocompatibilidade segura)
  if (!cipherText.includes(":")) return cipherText;

  try {
    const [ivHex, encryptedHex] = cipherText.split(":");
    if (!ivHex || !encryptedHex) return cipherText;

    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, iv);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch {
    // Se falhar a descriptografia, retorna o texto original ou vazio
    return cipherText;
  }
}
