import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente do Supabase para uso no navegador (Client Components)
 * Utiliza as chaves públicas configuradas no .env.local
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
