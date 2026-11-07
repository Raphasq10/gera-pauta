import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MAX_FREE_PITCHES, ResetQuotaRequestSchema } from "@/lib/schemas/quota";
import { getStripe } from "@/lib/stripe";

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
      .select("used_pitches, is_pro, user_api_key, stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    let usedPitches = profile?.used_pitches ?? 0;
    let isPro = profile?.is_pro === true;
    let isCanceled = false;

    // Sincroniza em tempo real com a Stripe o status exato da assinatura
    if (profile?.stripe_customer_id) {
      try {
        const stripe = getStripe();
        if (stripe) {
          const subs = await stripe.subscriptions.list({
            customer: profile.stripe_customer_id,
            status: "all",
            limit: 1
          });

          if (subs.data.length > 0) {
            const currentSub = subs.data[0];
            if (currentSub.status === "canceled" || currentSub.cancel_at_period_end) {
              isPro = false;
              isCanceled = true;
              if (profile.is_pro) {
                await supabase
                  .from("profiles")
                  .update({ is_pro: false })
                  .eq("id", user.id);
              }
            } else if (currentSub.status === "active" && !currentSub.cancel_at_period_end) {
              isPro = true;
              isCanceled = false;
            }
          }
        }
      } catch (stripeSyncErr) {
        console.warn("[QUOTA_STRIPE_SYNC_WARN]:", stripeSyncErr);
      }
    }

    const hasByok = Boolean(profile?.user_api_key && profile.user_api_key.trim());
    const remainingPitches = isPro || hasByok ? 999999 : Math.max(0, MAX_FREE_PITCHES - usedPitches);
    const canGenerate = isPro || hasByok || usedPitches < MAX_FREE_PITCHES;

    return NextResponse.json({
      success: true,
      quota: {
        usedPitches,
        maxFreePitches: MAX_FREE_PITCHES,
        isPro,
        isCanceled,
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

    // 3. Atualiza estritamente used_pitches = 0 sem afetar outras colunas (is_pro, stripe_customer_id, etc.)
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        used_pitches: 0
      })
      .eq("id", user.id);

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
