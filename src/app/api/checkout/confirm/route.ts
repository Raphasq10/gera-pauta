import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

/**
 * ============================================================================
 * ENDPOINT DE CONFIRMAÇÃO DIRETA DO CHECKOUT STRIPE
 * ============================================================================
 * 
 * Ativa o status PRO imediatamente quando o usuário é redirecionado para a tela de sucesso,
 * garantindo ativação instantânea mesmo antes ou independente do webhook.
 */

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { sessionId } = body;

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe não configurado." }, { status: 500 });
    }

    let customerId: string | null = null;
    let subscriptionId: string | null = null;

    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid" || session.status === "complete") {
        customerId = typeof session.customer === "string" ? session.customer : null;
        subscriptionId = typeof session.subscription === "string" ? session.subscription : null;
      }
    } else {
      // Se não passou sessionId, busca as assinaturas ativas do e-mail do usuário na Stripe
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
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

    // Ativa status PRO no Supabase
    await supabase
      .from("profiles")
      .update({
        is_pro: true,
        ...(customerId ? { stripe_customer_id: customerId } : {}),
        ...(subscriptionId ? { stripe_subscription_id: subscriptionId } : {})
      })
      .eq("id", user.id);

    return NextResponse.json({
      success: true,
      isPro: true,
      customerId,
      subscriptionId
    });
  } catch (error: any) {
    console.error("[CHECKOUT_CONFIRM_ERROR]:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Erro ao confirmar checkout." },
      { status: 500 }
    );
  }
}
