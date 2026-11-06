import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

/**
 * ============================================================================
 * WEBHOOK OFICIAL DA STRIPE (FEATURE 6 - CRITÉRIO DO PRD)
 * ============================================================================
 * 
 * Recebe notificações assíncronas de pagamento da Stripe:
 * - checkout.session.completed: ativa o plano PRO no perfil do usuário.
 * - invoice.payment_succeeded: renova a assinatura ativa.
 * - customer.subscription.deleted: revoga o plano PRO caso seja cancelado.
 */

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event: any = null;
  const rawBody = await req.text();

  // 1. Verificação Criptográfica da Assinatura do Webhook
  if (webhookSecret && stripe) {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.warn("[STRIPE_WEBHOOK_WARN] Cabeçalho stripe-signature ausente.");
      return NextResponse.json({ error: "Assinatura ausente." }, { status: 400 });
    }

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: any) {
      console.error("[STRIPE_WEBHOOK_SIGNATURE_ERROR]:", err?.message || err);
      return NextResponse.json({ error: "Assinatura de webhook inválida." }, { status: 400 });
    }
  } else {
    // Modo Sandbox / Sem Secret configurado: parse do JSON com segurança
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Payload JSON inválido." }, { status: 400 });
    }
  }

  const supabase = await createClient();

  // 2. Processamento do Evento
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.userId;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        if (userId) {
          console.log(`[STRIPE_WEBHOOK] Ativando PRO para usuário ${userId} via checkout.session.completed`);
          await supabase
            .from("profiles")
            .update({ 
              is_pro: true,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId
            })
            .eq("id", userId);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const customerEmail = invoice.customer_email;

        if (customerEmail) {
          console.log(`[STRIPE_WEBHOOK] Pagamento renovado com sucesso para ${customerEmail}`);
          await supabase
            .from("profiles")
            .update({ is_pro: true })
            .eq("email", customerEmail);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        console.log(`[STRIPE_WEBHOOK] Assinatura cancelada para cliente ${customerId}`);
        // Se houver coluna customerId ou metadata
        if (subscription.metadata?.userId) {
          await supabase
            .from("profiles")
            .update({ is_pro: false })
            .eq("id", subscription.metadata.userId);
        }
        break;
      }

      default:
        console.log(`[STRIPE_WEBHOOK] Evento não processado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[STRIPE_WEBHOOK_PROCESS_ERROR]:", error?.message || error);
    return NextResponse.json({ error: "Erro ao processar webhook." }, { status: 500 });
  }
}
