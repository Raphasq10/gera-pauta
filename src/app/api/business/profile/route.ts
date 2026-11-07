import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { businessProfileSchema } from "@/lib/schemas/business";
import { maskEmail } from "@/lib/schemas/auth";

/**
 * ============================================================================
 * ENDPOINT DE CONTEXTO DO NEGÓCIO (API RESTFUL COM VALIDAÇÃO & SEGURANÇA)
 * ============================================================================
 */

// 1. GET: Retorna o perfil de negócio do usuário autenticado
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login para acessar o contexto do negócio." },
        { status: 401 }
      );
    }

    const { data: business, error } = await supabase
      .from("businesses")
      .select("id, company_name, niche, tone_of_voice, key_pain, differential, main_product, forbidden_words, custom_personas, created_at, updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn(`[BUSINESS_PROFILE_FETCH_WARN] Erro ao buscar negócio: ${error.message}`);
      return NextResponse.json({ business: null });
    }

    return NextResponse.json({
      success: true,
      business: business ? {
        id: business.id,
        companyName: business.company_name,
        niche: business.niche,
        toneOfVoice: business.tone_of_voice,
        keyPain: business.key_pain,
        differential: business.differential,
        mainProduct: business.main_product,
        forbiddenWords: business.forbidden_words,
        customPersonas: business.custom_personas,
      } : null,
    });
  } catch (err: any) {
    console.error("[BUSINESS_PROFILE_GET_ERROR]:", err?.message || err);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}

// 2. POST: Salva ou atualiza o perfil de negócio com validação Zod e proteção Mass Assignment
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Verificação de Autorização
    if (!user) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login para salvar o perfil do negócio." },
        { status: 401 }
      );
    }

    const body = await request.json();

    // 2. Validação estrita com Zod no Servidor
    const parseResult = businessProfileSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Dados de negócio inválidos.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    // 3. Proteção contra Mass Assignment: extrai estritamente os campos permitidos
    const { companyName, niche, toneOfVoice, targetAudience, keyPain, differential, mainProduct, forbiddenWords, customPersonas } = parseResult.data;

    // Concatena de forma rica a persona no key_pain caso público-alvo tenha sido especificado
    const enrichedKeyPain = targetAudience 
      ? `[Público-Alvo: ${targetAudience}] - Maior Dor/Objeção: ${keyPain}`
      : keyPain;

    // 4. Salva na tabela 'businesses' no Supabase
    const { data: inserted, error: insertError } = await supabase
      .from("businesses")
      .insert({
        user_id: user.id,
        company_name: companyName,
        niche: niche,
        tone_of_voice: toneOfVoice,
        key_pain: enrichedKeyPain,
        differential: differential,
        main_product: mainProduct || null,
        forbidden_words: forbiddenWords || null,
        custom_personas: customPersonas || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error(`[BUSINESS_PROFILE_INSERT_ERROR]: ${insertError.message}`);
      return NextResponse.json(
        { error: "Não foi possível salvar o perfil no banco de dados. Tente novamente." },
        { status: 500 }
      );
    }

    // 5. Atualiza o nome da empresa no perfil do usuário
    await supabase
      .from("profiles")
      .update({ full_name: companyName })
      .eq("id", user.id);

    // 6. Log de auditoria seguro (sem expor segredos)
    console.info(`[BUSINESS_PROFILE_SAVED] Negócio salvo: "${companyName}" (${niche}) para usuário: ${maskEmail(user.email || "")}`);

    return NextResponse.json({
      success: true,
      message: "Perfil do negócio configurado com sucesso!",
      business: {
        id: inserted.id,
        companyName,
        niche,
        toneOfVoice,
        targetAudience,
        keyPain,
        differential,
      },
    });
  } catch (err: any) {
    console.error("[BUSINESS_PROFILE_POST_ERROR]:", err?.message || err);
    return NextResponse.json(
      { error: "Erro interno no servidor ao salvar contexto do negócio." },
      { status: 500 }
    );
  }
}
