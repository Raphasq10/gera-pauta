import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/onboarding";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Redireciona para a tela comemorativa de confirmação
      return NextResponse.redirect(`${origin}/auth/confirmed?next=${encodeURIComponent(next)}`);
    }
  }

  // Se o código for inválido ou expirado, retorna para login com mensagem clara
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
