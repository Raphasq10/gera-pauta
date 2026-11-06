import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

/**
 * ============================================================================
 * ENDPOINT DE CANCELAMENTO DIRETO DA ASSINATURA (AUTOATENDIMENTO NATIVO)
 * ============================================================================
 *
 * Permite ao usuário cancelar o plano PRO diretamente pelo app, mesmo se o
 * navegador tiver bloqueadores de anúncio ou restrições que impeçam o portal da Stripe.
 */

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login para gerenciar sua assinatura." },
        { status: 401 }
      );
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Integração com Stripe não configurada." },
        { status: 500 }
      );
    }

    // 1. Busca perfil do usuário
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, stripe_subscription_id")
      .eq("id", user.id)
      .maybeSingle();

    let subscriptionId = profile?.stripe_subscription_id;

    // Se não tiver ID da assinatura salvo, busca na Stripe pelo cliente ou e-mail
    if (!subscriptionId) {
      let customerId = profile?.stripe_customer_id;
      if (!customerId && user.email) {
        const customers = await stripe.customers.list({ email: user.email, limit: 1 });
        if (customers.data.length > 0) customerId = customers.data[0].id;
      }

      if (customerId) {
        const subs = await stripe.subscriptions.list({
          customer: customerId,
          status: "active",
          limit: 1
        });
        if (subs.data.length > 0) {
          subscriptionId = subs.data[0].id;
        }
      }
    }

    // 2. Se houver assinatura ativa na Stripe, efetua o cancelamento
    if (subscriptionId) {
      try {
        await stripe.subscriptions.cancel(subscriptionId);
      } catch (stripeErr: any) {
        console.warn("[STRIPE_CANCEL_WARNING]:", stripeErr?.message);
      }
    }

    // 3. Atualiza o status no banco de dados
    await supabase
      .from("profiles")
      .update({
        is_pro: false,
        stripe_subscription_id: null
      })
      .eq("id", user.id);

    return NextResponse.json({
      success: true,
      message: "Sua assinatura do Plano PRO foi cancelada com sucesso. Você voltou ao Plano Gratuito de testes."
    });
  } catch (error: any) {
    console.error("[CANCEL_SUBSCRIPTION_ERROR]:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Erro ao processar o cancelamento da assinatura." },
      { status: 500 }
    );
  }
}
