import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { emailSchema, maskEmail } from "@/lib/schemas/auth";
import { z } from "zod";

const resendSchema = z.object({
  email: emailSchema,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parseResult = resendSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }

    const { email } = parseResult.data;
    const origin = new URL(request.url).origin;

    const supabase = await createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${origin}/api/auth/callback?next=/onboarding`,
      },
    });

    if (error) {
      console.warn(`[AUTH_RESEND_FAIL] Falha para ${maskEmail(email)}: ${error.message}`);
      
      const message = error.message.toLowerCase().includes("security purposes") || error.message.toLowerCase().includes("rate limit")
        ? "Por segurança, aguarde 60 segundos antes de solicitar um novo e-mail."
        : "Não foi possível reenviar o e-mail no momento. Tente novamente mais tarde.";

      return NextResponse.json({ error: message }, { status: 400 });
    }

    console.info(`[AUTH_RESEND_SUCCESS] E-mail de confirmação reenviado para ${maskEmail(email)}`);

    return NextResponse.json({
      success: true,
      message: "Novo e-mail de confirmação enviado com sucesso!",
    });
  } catch (err: any) {
    console.error("[AUTH_RESEND_ERROR]:", err?.message || err);
    return NextResponse.json(
      { error: "Erro interno no servidor ao reenviar e-mail." },
      { status: 500 }
    );
  }
}
