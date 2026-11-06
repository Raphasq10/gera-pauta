import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TestApiKeySchema, maskApiKey } from "@/lib/schemas/byok";

/**
 * ============================================================================
 * ENDPOINT DE TESTE DE CONEXÃO DA CHAVE DE IA (FEATURE 5 - 1 CLIQUE)
 * ============================================================================
 * 
 * Faz uma chamada leve e rápida para validar a autenticidade e status da chave
 * no Google AI Studio, medindo o tempo de resposta (latência).
 */

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login para testar a chave." },
        { status: 401 }
      );
    }

    const rawBody = await request.json().catch(() => ({}));
    const parseResult = TestApiKeySchema.safeParse(rawBody);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Chave de API inválida.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { apiKey, provider } = parseResult.data;

    // Log seguro: NUNCA exibe a chave completa nos logs
    console.log(`[BYOK_TEST] Testando chave ${provider.toUpperCase()}: ${maskApiKey(apiKey)} para usuário ${user.id}`);

    // Testa a chave diretamente na API oficial do Google AI Studio (Gemini)
    const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
    
    const response = await fetch(testUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "ping" }] }],
        generationConfig: { maxOutputTokens: 5 }
      })
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const rawMsg = errorJson?.error?.message || "";

      console.warn(`[BYOK_TEST_FAIL] Status ${response.status}: ${rawMsg.slice(0, 100)}`);

      if (response.status === 400 || rawMsg.includes("API key not valid") || rawMsg.includes("API_KEY_INVALID")) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Chave do Google Gemini inválida. Verifique os caracteres e certifique-se de ter copiado a chave correta no Google AI Studio." 
          },
          { status: 400 }
        );
      }

      if (response.status === 429 || rawMsg.includes("RESOURCE_EXHAUSTED")) {
        return NextResponse.json(
          { 
            success: false, 
            error: "A chave é válida, mas atingiu o limite temporário de requisições por minuto do Google. Aguarde 60 segundos." 
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          error: `Falha na comunicação com o Google AI Studio (${response.status}). Tente novamente.` 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Conexão com Google AI Studio estabelecida com sucesso!",
      latencyMs,
      model: "gemini-2.5-flash",
      maskedKey: maskApiKey(apiKey)
    });
  } catch (err: any) {
    console.error("[BYOK_TEST_ERROR]:", err?.message || err);
    return NextResponse.json(
      { error: "Erro de conexão ao testar a chave. Verifique sua conexão com a internet." },
      { status: 500 }
    );
  }
}
