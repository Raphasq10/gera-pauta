import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SimulatePaymentSchema } from "@/lib/schemas/checkout";

/**
 * ============================================================================
 * ENDPOINT DE ATIVAÇÃO / SIMULAÇÃO DE PAGAMENTO (FEATURE 6)
 * ============================================================================
 * 
 * Usado pelo fluxo de sucesso do checkout e para testes manuais no ambiente de dev.
 * Atualiza o usuário autenticado para status PRO com segurança e autorização estrita.
 */

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Autorização
    if (!user) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login para ativar sua assinatura." },
        { status: 401 }
      );
    }

    const rawBody = await request.json().catch(() => ({}));
    const parseResult = SimulatePaymentSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Dados inválidos.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { planId, paymentMethod } = parseResult.data;

    // 2. Proteção contra Mass Assignment: atualiza estritamente os campos de assinatura
    const { error: dbError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        is_pro: true,
        email: user.email
      });

    if (dbError) {
      console.error("[SUBSCRIPTION_UPDATE_DB_ERROR]:", dbError.message);
      return NextResponse.json({ error: "Falha ao ativar plano no banco." }, { status: 500 });
    }

    console.log(`[SUBSCRIPTION_ACTIVATED] Usuário ${user.id} ativado para Plano PRO via ${paymentMethod} (${planId})`);

    return NextResponse.json({
      success: true,
      message: "🎉 Parabéns! Sua assinatura do Plano PRO foi ativada com sucesso!",
      isPro: true
    });
  } catch (error: any) {
    console.error("[SIMULATE_PAYMENT_ERROR]:", error?.message || error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao confirmar assinatura." },
      { status: 500 }
    );
  }
}
