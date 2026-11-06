import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { signUpSchema, maskEmail } from "@/lib/schemas/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validação obrigatória com Zod no Servidor
    const parseResult = signUpSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Dados de cadastro inválidos.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    // 2. Proteção contra Mass Assignment: apenas campos autorizados são extraídos
    const { email, password, companyName } = parseResult.data;

    const supabase = await createClient();

    // 3. Execução no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          company_name: companyName || null,
          full_name: companyName || null,
        },
      },
    });

    if (error) {
      console.warn(`[AUTH_SIGNUP_FAIL] Falha no cadastro de ${maskEmail(email)}: ${error.message}`);
      
      const userMessage = error.message.toLowerCase().includes("user already registered")
        ? "Este e-mail já está cadastrado. Tente fazer login ou redefinir sua senha."
        : error.message.toLowerCase().includes("password should be at least")
        ? "A senha deve ter pelo menos 6 caracteres."
        : "Não foi possível criar a conta. Tente novamente mais tarde.";

      return NextResponse.json({ error: userMessage }, { status: 400 });
    }

    console.info(`[AUTH_SIGNUP_SUCCESS] Nova conta criada: ${maskEmail(email)} (ID: ${data.user?.id})`);

    return NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    });
  } catch (err: any) {
    console.error("[AUTH_SIGNUP_ERROR] Erro inesperado:", err?.message || err);
    return NextResponse.json(
      { error: "Erro interno no servidor ao criar conta. Tente novamente." },
      { status: 500 }
    );
  }
}
