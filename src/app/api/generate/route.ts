import { NextRequest, NextResponse } from "next/server";
import { GeneratePitchesRequestSchema } from "@/lib/schemas";
import { callGoogleGeminiInteractions } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";
import { decryptText } from "@/lib/crypto";
import fs from "fs";
import path from "path";

// Caminho para histórico local de fallback
const PITCHES_PATH = path.join(process.cwd(), "src", "data", "saved-pitches.json");

function persistPitches(newPitches: any[]): void {
  try {
    let current = [];
    if (fs.existsSync(PITCHES_PATH)) {
      current = JSON.parse(fs.readFileSync(PITCHES_PATH, "utf-8"));
    }
    fs.writeFileSync(PITCHES_PATH, JSON.stringify([...newPitches, ...current], null, 2), "utf-8");
  } catch (e) {
    console.error("Falha ao persistir pautas no disco:", e);
  }
}

interface FallbackPitch {
  mote: string;
  headlineArte: string;
  headlineArteAlt: string;
  legenda: string;
  formato: string;
  justificativaFormato: string;
}

interface BusinessContext {
  companyName: string;
  niche: string;
  toneOfVoice: string;
  targetAudience: string;
  keyPain: string;
  differential: string;
  mainProduct?: string;
  forbiddenWords?: string;
  personaDetails?: {
    name?: string;
    role?: string;
    keyPain?: string;
    desire?: string;
    objection?: string;
  };
}

/**
 * Motor Criativo Local Adaptativo:
 * Gera pautas 100% contextualizadas com a marca do cliente, 2 opções de headline,
 * respeitando canal (Instagram, LinkedIn, WhatsApp, TikTok), objetivo e toggles.
 */
function generateOfflinePitches(
  business: BusinessContext,
  channel: string,
  goal: string,
  pitchCount: number,
  initialIdea?: string,
  includeEmojis: boolean = true,
  includeHashtags: boolean = true
): FallbackPitch[] {
  const company = business.companyName || "Nossa Empresa";
  const niche = business.niche || "Serviços Especializados";
  const pain = business.personaDetails?.keyPain || business.keyPain || "medo de errar na escolha ou gastar sem retorno";
  const diff = business.differential || "atendimento humanizado, agilidade e garantia";
  const ideaText = (initialIdea || "").trim();

  // CTA customizado por objetivo
  let ctaText = "";
  if (goal === "whatsapp") {
    ctaText = channel === "whatsapp" 
      ? "📲 *Responda esta mensagem agora para garantir seu atendimento exclusivo.*" 
      : "📲 Toque no link da bio e fale conosco diretamente pelo WhatsApp para tirar suas dúvidas!";
  } else if (goal === "comments") {
    ctaText = "💬 Deixe um comentário com a sua dúvida ou opinião que nós respondemos pessoalmente!";
  } else if (goal === "saves") {
    ctaText = "📌 Salve este post agora para não esquecer quando precisar dessa solução!";
  } else if (goal === "sales") {
    ctaText = "🔥 Restam poucos horários disponíveis nesta semana. Clique no link e garanta o seu!";
  } else {
    ctaText = "👉 Compartilhe este conteúdo com alguém que precisa saber disso hoje!";
  }

  // Tags do nicho
  const cleanNicheTag = niche.replace(/\s+/g, "");
  const cleanCompanyTag = company.replace(/\s+/g, "");
  const hashtagsBlock = includeHashtags 
    ? `\n\n#${cleanCompanyTag} #${cleanNicheTag} #Dicas #Resultados` 
    : "";

  const e = (emoji: string) => (includeEmojis ? emoji : "");

  const angles = [
    // Ângulo 1: Quebra de Objeção / Dor
    {
      mote: `Quebrar a principal dor do cliente ("${pain.slice(0, 45)}...") e posicionar a ${company} como a escolha mais segura.`,
      headlineArte: `Ainda com receio de ${pain.slice(0, 40)}? ${e("🤔")}`,
      headlineArteAlt: `Como ter tranquilidade com ${niche.toLowerCase()} sem cair em promessas vazias.`,
      legenda: channel === "whatsapp"
        ? `Olá! Sabemos que o medo de ${pain.slice(0, 50)} é real.\n\nNa *${company}*, o seu atendimento é baseado em *${diff}*.\n\n${ctaText}`
        : channel === "tiktok"
        ? `🎬 ROTEIRO DINÂMICO (3 CENAS):\n• Cena 1 (0-3s): "Você ainda tem medo de ${pain.slice(0, 35)}?"\n• Cena 2 (3-15s): Mostrando a solução da ${company} com foco em ${diff}.\n• Cena 3 (15-20s): Chamada para ação imediata.\n\n${e("📌 ")}LEGENDA:\nDescubra por que a ${company} é diferente. ${ctaText}${hashtagsBlock}`
        : `Muitas pessoas adiam o que precisam por medo ou experiências frustrantes do passado.\n\nNa ${company}, nós entendemos exatamente isso. Por isso, construímos todo o nosso método com foco em ${diff}.\n\n${ctaText}${hashtagsBlock}`,
      formato: channel === "tiktok" ? "Vídeo Rápido / Reels (3 Cenas)" : channel === "linkedin" ? "Artigo de Autoridade / Post Executivo" : "Carrossel Educativo (Mito vs. Verdade)",
      justificativaFormato: "Conduz o leitor da insegurança até a decisão de contato através de provas de valor tangíveis."
    },
    // Ângulo 2: Destaque de Diferencial Competitivo
    {
      mote: `Exaltar o diferencial da ${company} ("${diff.slice(0, 45)}...") frente a opções genéricas do mercado.`,
      headlineArte: `Por que tantas pessoas escolhem a ${company} para ${niche.toLowerCase()}? ${e("✨")}`,
      headlineArteAlt: `O detalhe que faz a ${company} ser referência em qualidade e segurança.`,
      legenda: channel === "whatsapp"
        ? `Você sabia? Quando o assunto é *${niche}*, a ${company} entrega *${diff}*.\n\n${ctaText}`
        : channel === "tiktok"
        ? `🎬 ROTEIRO (3 CENAS):\n• Cena 1: "O que ninguém te conta sobre ${niche.toLowerCase()}!"\n• Cena 2: Comparativo rápido de valor com ${diff}.\n• Cena 3: Finalização com CTA.\n\n${e("👉 ")}LEGENDA:\nA diferença de quem trabalha com padrão elevado. ${ctaText}${hashtagsBlock}`
        : `Quando se trata de ${niche}, a diferença real não está apenas no que é feito, mas em COMO é feito. ${e("✨")}\n\nNosso compromisso inegociável é entregar ${diff}, com foco total na sua satisfação.\n\n${ctaText}${hashtagsBlock}`,
      formato: channel === "linkedin" ? "Post de Liderança & Benchmarking" : "Card Único de Alto Impacto",
      justificativaFormato: "Comunica sofisticação, clareza e autoridade imediata no feed, sem ruídos desnecessários."
    },
    // Ângulo 3: Atendimento Direto ao Briefing / Gancho de Curiosidade
    {
      mote: ideaText 
        ? `Desenvolver a ideia do briefing: "${ideaText.slice(0, 50)}..."` 
        : `Provocar a reflexão sobre o custo de adiar uma solução para ${pain.slice(0, 35)}.`,
      headlineArte: ideaText 
        ? `${ideaText.slice(0, 45)}: o que você precisa saber? ${e("💡")}` 
        : `O que ninguém te conta sobre ${niche.toLowerCase()} nos dias de hoje? ${e("👀")}`,
      headlineArteAlt: ideaText 
        ? `${ideaText.slice(0, 50)} com garantia de excelência na ${company}.` 
        : `O caminho mais seguro e direto para alcançar seus objetivos em ${niche}.`,
      legenda: channel === "whatsapp"
        ? `${ideaText ? `*Novidade:* ${ideaText}\n\n` : ""}Na *${company}*, ajudamos você com *${diff}*.\n\n${ctaText}`
        : `${ideaText ? `${ideaText}\n\n` : ""}Se você busca resultados consistentes em ${niche}, precisa contar com quem entende do assunto de ponta a ponta.\n\nNa ${company}, cuidamos de cada detalhe com ${diff}.\n\n${ctaText}${hashtagsBlock}`,
      formato: channel === "whatsapp" ? "Mensagem Direta Formatada com Negrito" : "Reels / Vídeo Curto Explicativo",
      justificativaFormato: "Gera identificação instantânea com a novidade ou reflexão proposta."
    },
    // Ângulo 4: Conversão com Escassez
    {
      mote: `Criar senso de urgência e oportunidade para quem busca ${niche.toLowerCase()} nesta semana.`,
      headlineArte: `Procurando ${niche.toLowerCase()} com quem realmente entrega o prometido? ${e("⏳")}`,
      headlineArteAlt: `Garanta as melhores condições para o seu atendimento na ${company}.`,
      legenda: channel === "whatsapp"
        ? `Atenção: horários especiais abertos para *${niche}* nesta semana na *${company}*.\n\n${ctaText}`
        : `Cuidar das suas necessidades não precisa ser complicado nem demorado.\n\nOferecemos ${diff} para que você tenha total segurança desde o primeiro contato.\n\n${ctaText}${hashtagsBlock}`,
      formato: "Stories com Enquete Interativa + Link Direto",
      justificativaFormato: "Estimula a resposta rápida aproveitando a janela de atenção do usuário."
    },
    // Ângulo 5: Comparativo e Posicionamento de Valor
    {
      mote: `Comparar a frustração do amadorismo com o padrão de excelência da ${company}.`,
      headlineArte: `O barato que sai caro: por que você não deve arriscar em ${niche.toLowerCase()}? ${e("⚠️")}`,
      headlineArteAlt: `A tranquilidade de investir em quem garante ${diff.slice(0, 35)}.`,
      legenda: `Economizar no lugar errado costuma custar o dobro de dor de cabeça depois.\n\nNa ${company}, garantimos ${diff} para que você tenha a tranquilidade de um trabalho impecável.\n\n${ctaText}${hashtagsBlock}`,
      formato: "Carrossel Comparativo (Lado a Lado)",
      justificativaFormato: "Quebra a objeção de preço demonstrando valor tangível e riscos reais de soluções genéricas."
    }
  ];

  return angles.slice(0, Math.min(pitchCount, 5));
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // 1. Validação com Zod no Servidor
    const validation = GeneratePitchesRequestSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados de requisição inválidos",
          details: validation.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message
          }))
        },
        { status: 400 }
      );
    }

    const {
      channel,
      weeklyTheme,
      goal,
      includeEmojis = true,
      includeHashtags = true,
      pitchCount,
      initialIdea,
      userApiKey,
      businessContext
    } = validation.data;

    const effectiveGoal = goal || weeklyTheme || "whatsapp";

    // 2. Verificação de Quota no Backend (Feature 4 - Critério de Aceitação do PRD)
    let supabase: any = null;
    let authUser: any = null;
    let currentUsedPitches = 0;
    let userByokKey = "";
    const MAX_FREE_PITCHES = 5;

    try {
      supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      authUser = user;

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("used_pitches, is_pro, user_api_key")
          .eq("id", user.id)
          .maybeSingle();

        const isPro = profile?.is_pro === true;
        if (profile?.user_api_key) {
          userByokKey = decryptText(profile.user_api_key);
        }
        const hasByok = Boolean((userApiKey && userApiKey.trim()) || userByokKey);
        currentUsedPitches = profile?.used_pitches ?? 0;

        // Bloqueia no servidor caso o usuário tenha atingido as 5 pautas no plano grátis
        if (!isPro && !hasByok && currentUsedPitches >= MAX_FREE_PITCHES) {
          return NextResponse.json(
            {
              success: false,
              code: "QUOTA_EXCEEDED",
              error: "Você atingiu o limite de 5 pautas gratuitas de degustação! Assine o Plano Pro ou conecte sua chave de IA.",
              usedPitches: currentUsedPitches,
              maxFreePitches: MAX_FREE_PITCHES
            },
            { status: 403 }
          );
        }
      }
    } catch (authErr) {
      console.warn("[AUTH_QUOTA_CHECK_WARN]:", authErr);
    }

    // 3. Resolução do Contexto do Negócio (Memória de Marca Turbinada)
    let business: BusinessContext = {
      companyName: businessContext?.companyName || "Minha Empresa",
      niche: businessContext?.niche || "Negócio Local",
      toneOfVoice: businessContext?.toneOfVoice || "Profissional, acolhedor e direto",
      targetAudience: businessContext?.targetAudience || "Pessoas interessadas em soluções de qualidade",
      keyPain: businessContext?.keyPain || "Insegurança ou receio de não ter retorno",
      differential: businessContext?.differential || "Atendimento pontual e foco em resultados",
      mainProduct: businessContext?.mainProduct || undefined,
      forbiddenWords: businessContext?.forbiddenWords || undefined,
      personaDetails: businessContext?.personaDetails || undefined,
    };

    // Se o cliente não passou o contexto completo, tenta buscar do banco Supabase do usuário
    if (authUser && (!business.differential || !business.mainProduct)) {
      try {
        const { data: dbBusiness } = await supabase
          .from("businesses")
          .select("*")
          .eq("user_id", authUser.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (dbBusiness) {
          business = {
            companyName: dbBusiness.company_name || business.companyName,
            niche: dbBusiness.niche || business.niche,
            toneOfVoice: dbBusiness.tone_of_voice || business.toneOfVoice,
            targetAudience: business.targetAudience,
            keyPain: dbBusiness.key_pain || business.keyPain,
            differential: dbBusiness.differential || business.differential,
            mainProduct: business.mainProduct || dbBusiness.main_product || undefined,
            forbiddenWords: business.forbiddenWords || dbBusiness.forbidden_words || undefined,
            personaDetails: business.personaDetails,
          };
        }
      } catch {
        // safe ignore
      }
    }

    // 4. Arquitetura de Inteligência em 3 Níveis & Resiliência (Feature 5)
    // Nível 1: Chave BYOK do Usuário (se informada no payload ou salva criptografada no perfil)
    // Nível 2: Chave Oficial do Sistema (process.env.GEMINI_API_KEY ou .env.local)
    // Nível 3: Motor Criativo Local Offline Contextualizado (100% de disponibilidade)
    const effectiveUserKey = (userApiKey?.trim() || userByokKey).trim();
    let systemKey = process.env.GEMINI_API_KEY || "";
    if (!systemKey) {
      try {
        const envPath = path.join(process.cwd(), ".env.local");
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, "utf-8");
          const match = envContent.match(/GEMINI_API_KEY=["']?([^"'\r\n]+)["']?/);
          if (match && match[1]) systemKey = match[1].trim();
        }
      } catch {}
    }

    const primaryKey = effectiveUserKey || systemKey;
    const fallbackKey = effectiveUserKey && systemKey && effectiveUserKey !== systemKey ? systemKey : "";
    const isUsingByok = Boolean(effectiveUserKey && primaryKey === effectiveUserKey);

    // 5. Geração com Motor Inteligente e Resiliência Automática
    const personaName = business.personaDetails?.name || business.targetAudience;
    const personaRole = business.personaDetails?.role || "Cliente Ideal";
    const personaPain = business.personaDetails?.keyPain || business.keyPain;
    const personaDesire = business.personaDetails?.desire;
    const personaObjection = business.personaDetails?.objection;

    const ideaBlock = initialIdea?.trim()
      ? `🚨 REGRA DE PRIORIDADE MÁXIMA — BRIEFING / IDEIA ESPECÍFICA DO USUÁRIO:
O usuário definiu expressamente o tema e o objetivo deste post:
👉 "${initialIdea.trim()}"

DIRETRIZES MANDATÓRIAS DESTE BRIEFING:
1. O TEMA CENTRAL de cada pauta DEVE SER ESTRITAMENTE: "${initialIdea.trim()}".
2. Desenvolva o conteúdo com substância, clareza, autoridade e profundidade técnica acessível sobre esse assunto exato solicitado.
3. NÃO permita que a "Dor da Persona" sequestre ou desvie o tema (ex: se o usuário pediu 'critérios importantes para criar apps de sucesso', o post deve ensinar e debater esses critérios; NÃO mude o assunto para falar apenas de rejeição de app em loja ou bugs). A dor e os diferenciais servem como lentes e tom de voz, jamais para substituir a pauta solicitada.
4. O Call-to-Action (CTA) e o desfecho da legenda devem cumprir fielmente o que o usuário solicitou no briefing (ex: convidar expressamente para comentar experiências, se foi isso pedido, ou direcionar para o canal selecionado).`
      : `💡 Crie os melhores ângulos criativos estratégicos para quebrar a dor/objeção ("${personaPain}") e posicionar o diferencial da marca ("${business.differential}").`;

    const promptSystem = `Você é o Diretor de Criação & Estrategista de Conteúdo da plataforma "Gera Pauta".
Sua missão é criar exatamente ${pitchCount} pautas de redes sociais completas, autênticas e de ALTA CONVERSÃO para o seguinte cliente:

🏢 CONTEXTO E MEMÓRIA DE MARCA:
- Empresa / Marca: ${business.companyName}
- Nicho / Segmento: ${business.niche}
- Tom de Voz Obrigatório: ${business.toneOfVoice}
- Diferencial Competitivo Único: ${business.differential}
${business.mainProduct ? `- Oferta / Serviço Carro-Chefe: ${business.mainProduct}` : ""}
${business.forbiddenWords ? `- ⛔ DIRETRIZES NEGATIVAS (O QUE NUNCA FALAR / TERMOS PROIBIDOS): ${business.forbiddenWords}` : ""}

👥 PERSONA & PÚBLICO-ALVO SELECIONADO:
- Persona: ${personaName} (${personaRole})
- Dor Central: ${personaPain}
${personaDesire ? `- Maior Desejo / Transformação Buscada: ${personaDesire}` : ""}
${personaObjection ? `- Objeção Secreta que a IA DEVE quebrar na copy: ${personaObjection}` : ""}
- Rede Social de Destino: ${channel.toUpperCase()} (instagram, linkedin, whatsapp ou tiktok)
- Objetivo de Conversão da Pauta: ${effectiveGoal.toUpperCase()} (whatsapp, comments, saves, sales)
- Preferência de Emojis: ${includeEmojis ? "USAR emojis harmoniosos e bem posicionados." : "PROIBIDO usar emojis (texto 100% limpo sem nenhum emoji)."}
- Preferência de Hashtags: ${includeHashtags ? "INCLUIR 3 a 5 hashtags estratégicas no final da legenda." : "PROIBIDO incluir hashtags."}

${ideaBlock}

REGRAS OBRIGATÓRIAS DE ESTRUTURA PARA CADA PAUTA:
1. mote: Resumo estratégico em 1 linha sobre a intenção do conteúdo e o objetivo de negócio.
2. headlineArte: OPÇÃO 1 — Pergunta Provocativa ou Gancho de Curiosidade para interromper o scroll imediatamente (o que vai na imagem ou nos primeiros 3s do vídeo).
3. headlineArteAlt: OPÇÃO 2 — Afirmação de Impacto ou Gancho Posicionador de Autoridade (segunda opção de headline para o designer testar).
4. legenda: Copy completa, fluida, persuasiva, no tom "${business.toneOfVoice}". 
   - Se canal for "whatsapp": formato de mensagem direta com *negrito* nos pontos-chave e chamada rápida para resposta.
   - Se canal for "tiktok": inclua o roteiro de 3 cenas (Cena 1 Gancho 0-3s, Cena 2 Desenvolvimento 3-15s, Cena 3 CTA 15-20s) seguido da legenda.
   - Se canal for "linkedin": tom corporativo de liderança de pensamento, reflexão de mercado e dados.
   - Se canal for "instagram": copy escaneável com quebras de linha e chamada de ação clara.
   - CTA customizado: Direcionar especificamente para o objetivo "${effectiveGoal}".
5. formato: O formato recomendado (ex: "Carrossel de 3 lâminas", "Reels com gancho rápido", "Card Único de Alto Impacto", "Mensagem Direta com Negrito").
6. justificativaFormato: Explicação clara de por que este formato específico converte melhor para este objetivo.

RETORNE EXCLUSIVAMENTE UM ARRAY JSON VÁLIDO COM OS ${pitchCount} OBJETOS, SEM BLOCOS MARKDOWN ADICIONAIS:
[
  {
    "mote": "...",
    "headlineArte": "...",
    "headlineArteAlt": "...",
    "legenda": "...",
    "formato": "...",
    "justificativaFormato": "..."
  }
]`;

    let responseTextRaw = "";
    let engineSource = isUsingByok ? "user_byok" : "system_gemini";

    if (primaryKey) {
      try {
        const res = await callGoogleGeminiInteractions(primaryKey, promptSystem);
        responseTextRaw = res.text;
      } catch (err: any) {
        console.warn(`[GEMINI_PRIMARY_KEY_FAIL] Falha com a chave primária (${isUsingByok ? "BYOK do Usuário" : "Sistema"}):`, err?.message || err);

        // Resiliência de Nível 2: Tenta chave do sistema se o BYOK do usuário falhar
        if (fallbackKey) {
          try {
            console.log("[GEMINI_RESILIENCE] Ativando chave de contingência do sistema...");
            const res = await callGoogleGeminiInteractions(fallbackKey, promptSystem);
            responseTextRaw = res.text;
            engineSource = "system_gemini_fallback";
          } catch (fallbackErr: any) {
            console.warn("[GEMINI_SYSTEM_FALLBACK_FAIL]:", fallbackErr?.message || fallbackErr);
          }
        }
      }
    }

    let parsedPitches: FallbackPitch[] = [];
    if (responseTextRaw) {
      try {
        const cleanJson = responseTextRaw.replace(/```json\s*/gi, "").replace(/```\s*$/g, "").trim();
        parsedPitches = JSON.parse(cleanJson);
      } catch (parseErr) {
        console.warn("Fallback para o motor local após erro no parse:", parseErr);
      }
    }

    // Resiliência de Nível 3: Motor Criativo Local Offline se não houve resposta da IA
    if (!parsedPitches || parsedPitches.length === 0) {
      engineSource = "offline_fallback";
      parsedPitches = generateOfflinePitches(
        business, 
        channel, 
        effectiveGoal, 
        pitchCount, 
        initialIdea, 
        includeEmojis, 
        includeHashtags
      );
    }

    const formattedPitches = parsedPitches.map((p, idx) => ({
      id: `pitch-${Date.now()}-${idx}`,
      version: 1,
      createdAt: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }),
      channel,
      mote: p.mote,
      headlineArte: p.headlineArte,
      headlineArteAlt: p.headlineArteAlt || `Opção B: ${p.headlineArte.replace(/[?!]/g, "")} — Veja como funciona`,
      legenda: p.legenda,
      formato: p.formato,
      justificativaFormato: p.justificativaFormato
    }));

    persistPitches(formattedPitches);

    // Salva as pautas geradas e atualiza a cota no banco Supabase se autenticado
    let newUsed = currentUsedPitches;
    if (authUser && supabase) {
      try {
        // 1. Salva diretamente na tabela 'pitches' do Supabase no lado do servidor
        const rowsToInsert = formattedPitches.map((p) => ({
          user_id: authUser.id,
          channel: p.channel,
          goal: effectiveGoal,
          mote: p.mote,
          headline_arte: p.headlineArte,
          headline_arte_alt: p.headlineArteAlt,
          legenda: p.legenda,
          formato: p.formato,
          justificativa_formato: p.justificativaFormato
        }));

        const { error: insertPitchesErr } = await supabase.from("pitches").insert(rowsToInsert);
        if (insertPitchesErr) {
          console.warn("[PITCHES_SERVER_INSERT_WARN]:", insertPitchesErr.message);
        } else {
          console.log(`[PITCHES_SERVER_INSERT_SUCCESS] ${rowsToInsert.length} pautas salvas no Supabase para ${authUser.email}`);
        }

        // 2. Incrementa a contagem de pautas utilizadas
        newUsed = Math.min(currentUsedPitches + formattedPitches.length, MAX_FREE_PITCHES);
        await supabase
          .from("profiles")
          .update({ used_pitches: newUsed })
          .eq("id", authUser.id);
      } catch (dbErr) {
        console.warn("[GEMINI_QUOTA_INCREMENT_WARN]:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      source: engineSource,
      isByok: isUsingByok,
      message: `${pitchCount} pautas geradas com sucesso para ${business.companyName}!`,
      pitches: formattedPitches,
      quota: {
        usedPitches: newUsed,
        maxFreePitches: MAX_FREE_PITCHES,
        canGenerate: newUsed < MAX_FREE_PITCHES
      }
    });
  } catch (err: any) {
    console.error("[GENERATE_API_ERROR]:", err?.message || err);
    return NextResponse.json(
      { success: false, error: "Erro ao gerar pautas. Tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
