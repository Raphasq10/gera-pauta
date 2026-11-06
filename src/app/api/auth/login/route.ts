import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, maskEmail } from "@/lib/schemas/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validação obrigatória com Zod no Servidor
    const parseResult = loginSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Dados de login inválidos.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    // 2. Proteção contra Mass Assignment: desestruturação explícita apenas dos campos permitidos
    const { email, password } = parseResult.data;

    const supabase = await createClient();

    // 3. Execução no Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Log seguro (sem revelar senha)
      console.warn(`[AUTH_LOGIN_FAIL] Tentativa falha para: ${maskEmail(email)}. Motivo: ${error.message}`);

      // Mensagem amigável para o usuário (sem expor detalhes internos)
      const userMessage = error.message.toLowerCase().includes("invalid login credentials")
        ? "E-mail ou senha incorretos. Verifique suas credenciais."
        : "Não foi possível realizar o login. Tente novamente mais tarde.";

      return NextResponse.json({ error: userMessage }, { status: 401 });
    }

    // Log seguro de sucesso
    console.info(`[AUTH_LOGIN_SUCCESS] Usuário autenticado: ${maskEmail(email)} (ID: ${data.user?.id})`);

    return NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    });
  } catch (err: any) {
    console.error("[AUTH_LOGIN_ERROR] Erro inesperado:", err?.message || err);
    return NextResponse.json(
      { error: "Erro interno no servidor de autenticação. Tente novamente." },
      { status: 500 }
    );
  }
}
