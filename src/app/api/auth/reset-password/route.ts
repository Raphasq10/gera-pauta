import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resetPasswordSchema, maskEmail } from "@/lib/schemas/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parseResult = resetPasswordSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "E-mail inválido.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email } = parseResult.data;

    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.warn(`[AUTH_RESET_FAIL] Falha para ${maskEmail(email)}: ${error.message}`);
      return NextResponse.json(
        { error: "Não foi possível enviar o e-mail de recuperação. Tente novamente mais tarde." },
        { status: 400 }
      );
    }

    console.info(`[AUTH_RESET_SUCCESS] E-mail de recuperação enviado para: ${maskEmail(email)}`);

    return NextResponse.json({
      success: true,
      message: "Se o e-mail estiver cadastrado, você receberá um link de redefinição de senha em instantes.",
    });
  } catch (err: any) {
    console.error("[AUTH_RESET_ERROR]:", err?.message || err);
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar recuperação de senha." },
      { status: 500 }
    );
  }
}
