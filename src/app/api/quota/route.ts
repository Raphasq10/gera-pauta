import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MAX_FREE_PITCHES, ResetQuotaRequestSchema } from "@/lib/schemas/quota";

/**
 * ============================================================================
 * ENDPOINT DE CONTROLE DE QUOTA & DEGUSTAÇÃO (FEATURE 4)
 * ============================================================================
 */

// 1. GET: Retorna o saldo atual do usuário autenticado
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login para verificar sua quota." },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("used_pitches, is_pro, user_api_key")
      .eq("id", user.id)
      .maybeSingle();

    const usedPitches = profile?.used_pitches ?? 0;
    const isPro = profile?.is_pro === true;
    const hasByok = Boolean(profile?.user_api_key && profile.user_api_key.trim());
    const remainingPitches = isPro || hasByok ? 999999 : Math.max(0, MAX_FREE_PITCHES - usedPitches);
    const canGenerate = isPro || hasByok || usedPitches < MAX_FREE_PITCHES;

    return NextResponse.json({
      success: true,
      quota: {
        usedPitches,
        maxFreePitches: MAX_FREE_PITCHES,
        isPro,
        hasByok,
        canGenerate,
        remainingPitches
      }
    });
  } catch (error: any) {
    console.error("[QUOTA_GET_ERROR]:", error?.message || error);
    return NextResponse.json({ error: "Erro interno ao consultar quota." }, { status: 500 });
  }
}

// 2. POST: Reseta a quota do usuário para permitir testes contínuos de desenvolvimento
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Autorização
    if (!user) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login para resetar a quota." },
        { status: 401 }
      );
    }

    // 2. Validação com Zod no Servidor
    const body = await request.json().catch(() => ({}));
    const parseResult = ResetQuotaRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Dados inválidos para reset de quota." },
        { status: 400 }
      );
    }

    // 3. Proteção contra Mass Assignment: atualiza estritamente used_pitches = 0
    const { error: updateError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        used_pitches: 0,
        email: user.email
      });

    if (updateError) {
      console.error("[QUOTA_RESET_DB_ERROR]:", updateError.message);
      return NextResponse.json({ error: "Falha ao resetar saldo no banco." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Saldo de 5 pautas gratuitas restaurado com sucesso!",
      quota: {
        usedPitches: 0,
        maxFreePitches: MAX_FREE_PITCHES,
        canGenerate: true,
        remainingPitches: MAX_FREE_PITCHES
      }
    });
  } catch (error: any) {
    console.error("[QUOTA_POST_ERROR]:", error?.message || error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
