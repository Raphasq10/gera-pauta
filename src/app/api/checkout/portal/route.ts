import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

/**
 * ============================================================================
 * ENDPOINT DO PORTAL DO CLIENTE STRIPE (GERENCIAMENTO & CANCELAMENTO)
 * ============================================================================
 * 
 * Permite ao usuário assinante PRO:
 * - Cancelar a assinatura com 1 clique de forma autônoma
 * - Trocar ou atualizar o cartão de crédito
 * - Baixar recibos e faturas anteriores
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

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 1. Busca o ID do cliente da Stripe no banco ou na API da Stripe
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id;

    // Se ainda não tiver stripe_customer_id salvo, busca na Stripe pelo e-mail
    if (!customerId && user.email) {
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1
      });

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        // Salva para consultas futuras
        await supabase
          .from("profiles")
          .update({ stripe_customer_id: customerId })
          .eq("id", user.id);
      } else {
        // Cria um cliente na Stripe caso não exista
        const newCustomer = await stripe.customers.create({
          email: user.email,
          metadata: { userId: user.id }
        });
        customerId = newCustomer.id;
        await supabase
          .from("profiles")
          .update({ stripe_customer_id: customerId })
          .eq("id", user.id);
      }
    }

    if (!customerId) {
      return NextResponse.json(
        { error: "Cliente não localizado na Stripe." },
        { status: 404 }
      );
    }

    // 2. Cria a Sessão segura do Portal do Cliente da Stripe
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/dashboard`
    });

    return NextResponse.json({
      success: true,
      url: portalSession.url
    });
  } catch (error: any) {
    console.error("[STRIPE_PORTAL_ERROR]:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Erro ao abrir portal de gerenciamento da assinatura." },
      { status: 500 }
    );
  }
}
