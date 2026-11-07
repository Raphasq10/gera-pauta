import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CreateCheckoutSessionSchema } from "@/lib/schemas/checkout";
import { getStripe, isStripeConfigured, PLAN_CONFIG } from "@/lib/stripe";

/**
 * ============================================================================
 * ENDPOINT DE CRIAÇÃO DE CHECKOUT DE ASSINATURA (FEATURE 6)
 * ============================================================================
 * 
 * Cria uma Sessão de Checkout segura na Stripe ou fornece redirect sandbox
 * de desenvolvimento para testes instantâneos.
 */

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Verificação de Autorização
    if (!user) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login para assinar um plano." },
        { status: 401 }
      );
    }

    // 2. Validação com Zod no Servidor
    const rawBody = await request.json().catch(() => ({}));
    const parseResult = CreateCheckoutSessionSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Dados de checkout inválidos.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { planId } = parseResult.data;
    const plan = PLAN_CONFIG[planId] || PLAN_CONFIG.pro_monthly;

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const stripe = getStripe();

    // 3. Se a Stripe estiver configurada com chave real no ambiente
    if (stripe) {
      try {
        const configuredPriceId = process.env.STRIPE_PRICE_ID_PRO?.trim();
        const lineItem = (planId === "pro_monthly" && configuredPriceId)
          ? {
              price: configuredPriceId,
              quantity: 1
            }
          : {
              price_data: {
                currency: "brl",
                product_data: {
                  name: `Gera Pauta AI — ${plan.name}`,
                  description: plan.description,
                  images: [`${origin}/images/logo.png`]
                },
                unit_amount: plan.priceInCents,
                recurring: {
                  interval: plan.interval
                }
              },
              quantity: 1
            };

        // Busca se o usuário já possui registro de cliente na Stripe para não duplicar
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("stripe_customer_id")
          .eq("id", user.id)
          .maybeSingle();

        const customerParams = userProfile?.stripe_customer_id
          ? { customer: userProfile.stripe_customer_id }
          : { customer_email: user.email };

        const session = await stripe.checkout.sessions.create({
          line_items: [lineItem],
          mode: "subscription",
          allow_promotion_codes: true,
          payment_method_collection: "if_required",
          client_reference_id: user.id,
          ...customerParams,
          metadata: {
            userId: user.id,
            planId: plan.id
          },
          success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/checkout/cancel`
        });

        console.log(`[STRIPE_CHECKOUT_CREATED] Sessão criada: ${session.id} para usuário ${user.id}`);

        return NextResponse.json({
          success: true,
          url: session.url
        });
      } catch (stripeError: any) {
        console.error("[STRIPE_API_ERROR]:", stripeError?.message || stripeError);
        return NextResponse.json(
          { error: `Erro na Stripe: ${stripeError?.message || "Falha ao gerar tela de pagamento."}` },
          { status: 400 }
        );
      }
    }

    // 4. Se a chave da Stripe não estiver presente no ambiente da Vercel
    return NextResponse.json(
      { 
        error: "A chave STRIPE_SECRET_KEY não foi encontrada neste deploy da Vercel. Por favor, clique na aba Deployments da Vercel e faça o Redeploy para carregar as variáveis de ambiente recém-salvas." 
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("[CHECKOUT_ROUTE_ERROR]:", error?.message || error);
    return NextResponse.json(
      { error: "Erro interno ao processar checkout. Tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
