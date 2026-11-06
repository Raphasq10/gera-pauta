import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente Supabase para uso exclusivo no Servidor (Server Components, Route Handlers).
 * Ele gerencia cookies de forma segura e sincronizada com o Next.js 16.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jlvwallwcrpibawrxsgt.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_mfANl-Hwb367wt8S_-lAxg_xPhhXurR";

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // O método setAll pode disparar aviso se chamado em Server Component estático.
          // O middleware cuida da sincronização contínua de cookies.
        }
      },
    },
  });
}
