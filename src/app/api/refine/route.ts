import { NextRequest, NextResponse } from "next/server";
import { RefinePitchRequestSchema } from "@/lib/schemas";
import { callGoogleGeminiInteractions } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

const PITCHES_PATH = path.join(process.cwd(), "src", "data", "saved-pitches.json");

function getSavedPitches(): any[] {
  if (!fs.existsSync(PITCHES_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(PITCHES_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function savePitches(pitches: any[]): void {
  try {
    fs.writeFileSync(PITCHES_PATH, JSON.stringify(pitches, null, 2), "utf-8");
  } catch {
    // Safe ignore em ambientes serverless/read-only
  }
}

const FORMAT_LABELS: Record<string, string> = {
  reels: "Reels / TikTok (Vídeo em 3 Cenas)",
  carrossel: "Carrossel Educativo (3 a 5 Telas)",
  card: "Card Único de Alto Impacto",
  stories: "Sequência de Stories com Enquete e Link",
  linkedin: "Post Executivo / Artigo de Autoridade",
  whatsapp: "Mensagem Direta com Negrito"
};

/**
 * Motor Local de Refinamento e Reescrita Contextualizada:
 * Garante que a pauta seja reescrita de verdade caso o usuário esteja sem chave de IA.
 */
function smartLocalRewrite(
  currentPitch: any,
  instruction: string,
  targetFormatKey: string,
  targetToneKey: string,
  business: any,
  channel: string,
  includeEmojis: boolean = true,
  includeHashtags: boolean = true
) {
  const cleanInstr = (instruction || "").trim();
  const nextVersion = (currentPitch.version || 1) + 1;
  const company = business?.companyName || "Nossa Empresa";
  const niche = business?.niche || "Serviços Especializados";
  const diff = business?.differential || "qualidade garantida e atendimento rápido";
  const finalChannel = channel || currentPitch.channel || "instagram";

  const finalFormat =
    targetFormatKey && targetFormatKey !== "manter"
      ? FORMAT_LABELS[targetFormatKey] || targetFormatKey
      : currentPitch.formato;

  const e = (emoji: string) => (includeEmojis ? emoji : "");
  const tagBlock = includeHashtags 
    ? `\n\n#${company.replace(/\s+/g, "")} #${niche.replace(/\s+/g, "")} #Novidade`
    : "";

  let headlineOptionA = "";
  let headlineOptionB = "";
  let legenda = "";

  if (finalChannel === "whatsapp") {
    headlineOptionA = `Aviso especial da ${company}: veja o que preparamos para você! ${e("📲")}`;
    headlineOptionB = `Condição exclusiva para atendimento em ${niche} nesta semana.`;
    legenda = `Olá! Passando para compartilhar uma atualização importante:\n\n*${cleanInstr || "Nova oportunidade exclusiva para o seu atendimento."}*\n\nNa *${company}*, garantimos *${diff}* em cada etapa.\n\n👉 *Responda esta mensagem agora para saber mais.*`;
  } else if (finalChannel === "tiktok") {
    headlineOptionA = `${cleanInstr ? cleanInstr.slice(0, 45) : `O que ninguém te conta sobre ${niche.toLowerCase()}`} ${e("👀")}`;
    headlineOptionB = `O segredo para ter os melhores resultados com a ${company}.`;
    legenda = `🎬 ROTEIRO EM 3 CENAS:\n• Cena 1 (0-3s): Gancho dinâmico com a frase: "${headlineOptionA}"\n• Cena 2 (3-15s): Apresentando o foco em "${cleanInstr || diff}".\n• Cena 3 (15-20s): Chamada para ação imediata.\n\n${e("📌 ")}LEGENDA:\nQuer saber mais? Clique no link da bio e fale com a gente!${tagBlock}`;
  } else if (finalChannel === "linkedin") {
    headlineOptionA = `Como a busca por excelência está redefinindo o padrão em ${niche}?`;
    headlineOptionB = `Inovação e solidez: as lições práticas aplicadas na ${company}.`;
    legenda = `No cenário atual de ${niche}, a consistência e a clareza estratégica são diferenciais competitivos fundamentais.\n\n${cleanInstr ? `Reflexão recente: "${cleanInstr}".\n\n` : ""}Na ${company}, nosso foco contínuo é proporcionar ${diff}.\n\nQual a sua perspectiva sobre esse ponto? Compartilhe nos comentários.${tagBlock}`;
  } else {
    headlineOptionA = cleanInstr 
      ? `${cleanInstr.slice(0, 45)}: confira esta novidade! ${e("✨")}` 
      : `Procurando o melhor para ${niche.toLowerCase()}? ${e("🚀")}`;
    headlineOptionB = `A diferença real de contar com quem garante ${diff.slice(0, 35)}.`;
    legenda = `${cleanInstr ? `Atenção: ${cleanInstr}\n\n` : ""}Se você valoriza qualidade e segurança em ${niche}, a ${company} é a sua melhor escolha.\n\nTrabalhamos focados em ${diff} para que você tenha a melhor experiência possível.\n\n💬 Fale com nossa equipe pelo link da bio e tire suas dúvidas agora mesmo!${tagBlock}`;
  }

  return {
    mote: `Pauta Ajustada (v${nextVersion}): diretriz atendida — "${cleanInstr || "ajuste de formato e tom de voz"}".`,
    headlineArte: headlineOptionA,
    headlineArteAlt: headlineOptionB,
    legenda,
    formato: finalFormat,
    justificativaFormato: `Formato "${finalFormat}" adaptado sob medida para o canal ${finalChannel.toUpperCase()} e para a solicitação: "${cleanInstr.slice(0, 40)}...".`
  };
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // 1. Validação Estrita com Zod no Servidor
    const validation = RefinePitchRequestSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados de refinamento inválidos.",
          details: validation.error.issues.map((i) => ({ field: i.path.join("."), message: i.message }))
        },
        { status: 400 }
      );
    }

    const { 
      pitchId, 
      pitch: clientPitch, 
      instruction, 
      format, 
      tone, 
      channel: requestedChannel,
      includeEmojis = true, 
      includeHashtags = true, 
      userApiKey,
      businessContext 
    } = validation.data;

    // 2. Localizar a pauta a ser refinada (payload ou cache local)
    const pitches = getSavedPitches();
    const pitchIndex = pitches.findIndex((p) => p.id === pitchId);
    const currentPitch = clientPitch || (pitchIndex !== -1 ? pitches[pitchIndex] : null);

    if (!currentPitch) {
      return NextResponse.json(
        { success: false, error: "Pauta não encontrada no histórico para ajuste." },
        { status: 404 }
      );
    }

    const effectiveChannel = requestedChannel || currentPitch.channel || "instagram";

    // 3. Resolver Contexto de Negócio
    let business = {
      companyName: businessContext?.companyName || "Minha Empresa",
      niche: businessContext?.niche || "Negócio Local",
      toneOfVoice: businessContext?.toneOfVoice || "Profissional e acolhedor",
      keyPain: businessContext?.keyPain || "medo de não ter retorno",
      differential: businessContext?.differential || "atendimento ágil e excelência"
    };

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: dbBiz } = await supabase
          .from("businesses")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (dbBiz) {
          business = {
            companyName: dbBiz.company_name || business.companyName,
            niche: dbBiz.niche || business.niche,
            toneOfVoice: dbBiz.tone_of_voice || business.toneOfVoice,
            keyPain: dbBiz.key_pain || business.keyPain,
            differential: dbBiz.differential || business.differential
          };
        }
      }
    } catch {}

    // Salvar estado atual no histórico de versões
    const previousVersion = {
      version: currentPitch.version || 1,
      mote: currentPitch.mote,
      headlineArte: currentPitch.headlineArte,
      headlineArteAlt: currentPitch.headlineArteAlt,
      legenda: currentPitch.legenda,
      formato: currentPitch.formato,
      changeNote: instruction || `Ajuste para ${format} / ${tone}`
    };

    const targetFormatLabel =
      format && format !== "manter"
        ? FORMAT_LABELS[format] || format
        : currentPitch.formato;

    // 4. Determinar chave Gemini
    let geminiApiKey = userApiKey?.trim() || process.env.GEMINI_API_KEY || "";
    if (!geminiApiKey) {
      try {
        const envPath = path.join(process.cwd(), ".env.local");
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, "utf-8");
          const match = envContent.match(/GEMINI_API_KEY=["']?([^"'\r\n]+)["']?/);
          if (match && match[1]) geminiApiKey = match[1].trim();
        }
      } catch {}
    }

    let rewritten: any = null;
    let engineUsed = "local_refine";

    // 5. Chamada de IA Gemini
    if (geminiApiKey) {
      try {
        const prompt = `Você é o Diretor Criativo e Copywriter Sênior da plataforma "Gera Pauta".
O usuário pediu para reescrever/ajustar uma pauta específica de redes sociais.

🏢 CONTEXTO E MEMÓRIA DE MARCA:
- Empresa: ${business.companyName}
- Nicho: ${business.niche}
- Tom de Voz: ${business.toneOfVoice}
- Diferencial: ${business.differential}
- Rede Social: ${effectiveChannel.toUpperCase()}

📌 PAUTA ATUAL:
- Mote Atual: ${currentPitch.mote}
- Headline Atual: ${currentPitch.headlineArte}
- Legenda Atual: ${currentPitch.legenda}
- Formato Atual: ${currentPitch.formato}

💡 INSTRUÇÃO DE AJUSTE DO USUÁRIO (PRIORIDADE ABSOLUTA):
"${instruction}"
- Formato desejado: ${targetFormatLabel}
- Tom desejado: ${tone !== "manter" ? tone : business.toneOfVoice}
- Emojis: ${includeEmojis ? "SIM, use emojis elegantes." : "NÃO, zero emojis."}
- Hashtags: ${includeHashtags ? "SIM, termine com 3 hashtags relevantes." : "NÃO use hashtags."}

REGRAS OBRIGATÓRIAS:
1. Atenda rigorosamente à instrução do usuário.
2. Crie DUAS opções de Headline:
   - headlineArte: Opção 1 (Pergunta Provocativa ou Gancho Direto).
   - headlineArteAlt: Opção 2 (Afirmação de Impacto Posicionadora).
3. Reescreva a legenda no tom solicitado com CTA claro para o canal ${effectiveChannel}.

RETORNE EXCLUSIVAMENTE UM OBJETO JSON VÁLIDO:
{
  "mote": "...",
  "headlineArte": "...",
  "headlineArteAlt": "...",
  "legenda": "...",
  "formato": "${targetFormatLabel}",
  "justificativaFormato": "..."
}`;

        const { text: responseTextRaw, model: modelUsed } = await callGoogleGeminiInteractions(geminiApiKey, prompt);
        engineUsed = `gemini_${modelUsed}`;

        const cleanJson = responseTextRaw.replace(/```json\s*/gi, "").replace(/```\s*$/g, "").trim();
        const parsed = JSON.parse(cleanJson);
        if (parsed.headlineArte && parsed.legenda) {
          rewritten = {
            mote: parsed.mote || currentPitch.mote,
            headlineArte: parsed.headlineArte,
            headlineArteAlt: parsed.headlineArteAlt || `Opção B: ${parsed.headlineArte.replace(/[?!]/g, "")}`,
            legenda: parsed.legenda,
            formato: parsed.formato || targetFormatLabel,
            justificativaFormato: parsed.justificativaFormato || currentPitch.justificativaFormato
          };
        }
      } catch (geminiError) {
        console.warn("[REFINE_GEMINI_FALLBACK] Alternando para reescrita inteligente local:", geminiError);
      }
    }

    if (!rewritten) {
      rewritten = smartLocalRewrite(
        currentPitch, 
        instruction || "", 
        format || "manter", 
        tone || "manter", 
        business, 
        effectiveChannel,
        includeEmojis,
        includeHashtags
      );
    }

    // 6. Montar pauta atualizada com versionamento
    const nextVersionNumber = (currentPitch.version || 1) + 1;
    const updatedPitch = {
      ...currentPitch,
      version: nextVersionNumber,
      channel: effectiveChannel,
      mote: rewritten.mote,
      headlineArte: rewritten.headlineArte,
      headlineArteAlt: rewritten.headlineArteAlt,
      legenda: rewritten.legenda,
      formato: rewritten.formato,
      justificativaFormato: rewritten.justificativaFormato,
      previousVersions: [...(currentPitch.previousVersions || []), previousVersion]
    };

    // Atualiza no cache local se existir
    if (pitchIndex !== -1) {
      pitches[pitchIndex] = updatedPitch;
      savePitches(pitches);
    }

    // Atualiza no Supabase se usuário estiver logado
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("pitches")
          .update({
            channel: effectiveChannel,
            mote: updatedPitch.mote,
            headline_arte: updatedPitch.headlineArte,
            headline_arte_alt: updatedPitch.headlineArteAlt,
            legenda: updatedPitch.legenda,
            formato: updatedPitch.formato,
            justificativa_formato: updatedPitch.justificativaFormato
          })
          .eq("id", currentPitch.id)
          .eq("user_id", user.id);
      }
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Pauta ajustada com sucesso para a versão v${nextVersionNumber}!`,
      engine: engineUsed,
      pitch: updatedPitch
    });
  } catch (error: any) {
    console.error("[REFINE_API_ERROR]:", error?.message || error);
    return NextResponse.json(
      { success: false, error: "Ocorreu um erro ao ajustar a pauta. Tente novamente." },
      { status: 500 }
    );
  }
}
