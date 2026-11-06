import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SaveApiKeySchema, maskApiKey } from "@/lib/schemas/byok";
import { encryptText, decryptText } from "@/lib/crypto";

/**
 * ============================================================================
 * ENDPOINT DE GESTÃO DA CHAVE DE IA DO USUÁRIO (BYOK - FEATURE 5)
 * ============================================================================
 * 
 * Permite salvar, consultar e desativar a chave de API de forma criptografada
 * com proteção contra Mass Assignment e autorização via sessão Supabase.
 */

// 1. GET: Retorna o status da chave configurada (mascarada, nunca expõe texto puro)
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login para acessar as configurações de IA." },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("user_api_key")
      .eq("id", user.id)
      .maybeSingle();

    const rawEncryptedKey = profile?.user_api_key || "";
    const decryptedKey = decryptText(rawEncryptedKey);
    const hasKey = Boolean(decryptedKey && decryptedKey.trim().length > 10);

    return NextResponse.json({
      success: true,
      hasKey,
      maskedKey: hasKey ? maskApiKey(decryptedKey) : null,
      provider: "gemini"
    });
  } catch (error: any) {
    console.error("[BYOK_GET_ERROR]:", error?.message || error);
    return NextResponse.json({ error: "Erro interno ao consultar chave." }, { status: 500 });
  }
}

// 2. POST: Salva a chave criptografada no banco
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Autorização
    if (!user) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login para salvar sua chave." },
        { status: 401 }
      );
    }

    // 2. Validação com Zod no Servidor
    const rawBody = await request.json().catch(() => ({}));
    const parseResult = SaveApiKeySchema.safeParse(rawBody);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Dados inválidos.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { apiKey, provider } = parseResult.data;

    // 3. Criptografia da chave antes de gravar no banco
    const encryptedKey = encryptText(apiKey);

    // 4. Proteção contra Mass Assignment: atualiza estritamente user_api_key
    const { error: dbError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        user_api_key: encryptedKey,
        email: user.email
      });

    if (dbError) {
      console.error("[BYOK_SAVE_DB_ERROR]:", dbError.message);
      return NextResponse.json({ error: "Falha ao gravar chave no banco." }, { status: 500 });
    }

    console.log(`[BYOK_SAVED] Chave ${provider.toUpperCase()} salva com sucesso para o usuário ${user.id} (${maskApiKey(apiKey)})`);

    return NextResponse.json({
      success: true,
      message: "Chave do Google AI Studio salva e criptografada com sucesso! Potencializador ativado.",
      maskedKey: maskApiKey(apiKey),
      hasKey: true
    });
  } catch (error: any) {
    console.error("[BYOK_POST_ERROR]:", error?.message || error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}

// 3. DELETE: Desconecta a chave do usuário
export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 }
      );
    }

    const { error: dbError } = await supabase
      .from("profiles")
      .update({ user_api_key: null })
      .eq("id", user.id);

    if (dbError) {
      return NextResponse.json({ error: "Falha ao remover chave." }, { status: 500 });
    }

    console.log(`[BYOK_REMOVED] Chave desvinculada para o usuário ${user.id}`);

    return NextResponse.json({
      success: true,
      message: "Chave de IA desconectada com sucesso. O sistema voltará ao plano padrão."
    });
  } catch (error: any) {
    console.error("[BYOK_DELETE_ERROR]:", error?.message || error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
