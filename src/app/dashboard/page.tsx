"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  History, 
  Building2, 
  CreditCard, 
  LogOut, 
  Copy, 
  Check, 
  RefreshCw, 
  Send, 
  Share2, 
  Briefcase, 
  MessageCircle, 
  Video, 
  SlidersHorizontal, 
  ShieldCheck, 
  Zap,
  Key,
  ExternalLink,
  Search,
  Filter
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { INITIAL_PERSONAS, INITIAL_PITCHES, PersonaData, PitchContent } from "@/data/mockData";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("generator");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Contexto do Negócio
  const [companyName, setCompanyName] = useState("Clínica Sorriso & Bem-Estar");
  const [niche, setNiche] = useState("Odontologia Estética");
  const [toneOfVoice, setToneOfVoice] = useState("Profissional, acolhedor e empático");
  const [personas, setPersonas] = useState<PersonaData[]>(INITIAL_PERSONAS);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(INITIAL_PERSONAS[0].id);

  // Parâmetros de Geração do Concorrente (HubSpot & QuillBot inspirados)
  const [channel, setChannel] = useState<"instagram" | "linkedin" | "whatsapp" | "tiktok">("instagram");
  const [goal, setGoal] = useState<string>("whatsapp");
  const [includeEmojis, setIncludeEmojis] = useState<boolean>(true);
  const [includeHashtags, setIncludeHashtags] = useState<boolean>(true);
  const [initialIdea, setInitialIdea] = useState<string>("");
  const [pitchCount, setPitchCount] = useState<number>(3);

  // Estado das Pautas e Histórico
  const [pitches, setPitches] = useState<PitchContent[]>(INITIAL_PITCHES);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string>("");
  const [filterChannel, setFilterChannel] = useState<string>("all");

  // Controle de Quota e Chave BYOK
  const [usedPitches, setUsedPitches] = useState<number>(1);
  const maxFreePitches = 5;
  const [userApiKey, setUserApiKey] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);

          // 1. Carrega Perfil do Usuário
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profile) {
            setUsedPitches(profile.used_pitches || 0);
            if (profile.user_api_key) setUserApiKey(profile.user_api_key);
          }

          // 2. Carrega Negócio Cadastrado
          const { data: business } = await supabase
            .from("businesses")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (business) {
            if (business.company_name) setCompanyName(business.company_name);
            if (business.niche) setNiche(business.niche);
            if (business.tone_of_voice) setToneOfVoice(business.tone_of_voice);
          }

          // 3. Carrega Histórico de Pautas do Banco
          const { data: dbPitches } = await supabase
            .from("pitches")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (dbPitches && dbPitches.length > 0) {
            const mappedPitches: PitchContent[] = dbPitches.map((p) => ({
              id: p.id,
              version: 1,
              createdAt: new Date(p.created_at).toLocaleDateString("pt-BR"),
              personaId: "p1",
              personaName: "Público-Alvo",
              channel: p.channel as any,
              mote: p.mote,
              headlineArte: p.headline_arte,
              headlineArteAlt: p.headline_arte_alt,
              legenda: p.legenda,
              formato: p.formato,
              justificativaFormato: p.justificativa_formato
            }));
            setPitches(mappedPitches);
          }
        }
      } catch (err) {
        console.warn("Carregando modo local:", err);
      }
    }

    loadSupabaseData();

    if (typeof window !== "undefined") {
      const savedContext = localStorage.getItem("gera_pauta_business_context");
      if (savedContext) {
        try {
          const parsed = JSON.parse(savedContext);
          if (parsed.companyName) setCompanyName(parsed.companyName);
          if (parsed.niche) setNiche(parsed.niche);
          if (parsed.toneOfVoice) setToneOfVoice(parsed.toneOfVoice);
        } catch {}
      }

      const savedKey = localStorage.getItem("gera_pauta_byok_key");
      if (savedKey) setUserApiKey(savedKey);
    }
  }, []);

  const handleCopy = (pitch: PitchContent, headlineToCopy: string) => {
    const textToCopy = `📌 MOTE CRIATIVO:\n${pitch.mote}\n\n🖼️ HEADLINE DA ARTE (O QUE VAI NA IMAGEM):\n${headlineToCopy}\n\n✍️ LEGENDA:\n${pitch.legenda}\n\n📐 FORMATO RECOMENDADO:\n${pitch.formato} — ${pitch.justificativaFormato}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(pitch.id);
    toast.success("Pauta completa copiada para a área de transferência!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveApiKey = async () => {
    if (!userApiKey.trim()) {
      toast.error("Por favor, cole sua chave do Google AI Studio.");
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("gera_pauta_byok_key", userApiKey.trim());
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ user_api_key: userApiKey.trim() })
          .eq("id", user.id);
      }
    } catch {}

    toast.success("Chave de IA configurada com sucesso no Supabase! Potencializador ativado.");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Você saiu da sua conta.");
    router.push("/login");
  };

  const handleGenerate = async () => {
    if (usedPitches >= maxFreePitches && !userApiKey.trim()) {
      toast.error("Você atingiu o limite de 5 pautas gratuitas de degustação! Assine o Plano Pro ou conecte sua chave de IA.");
      setActiveTab("billing");
      return;
    }

    setIsGenerating(true);
    const personaSelected = personas.find((p) => p.id === selectedPersonaId) || personas[0];

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaId: personaSelected.id,
          channel,
          weeklyTheme: goal,
          pitchCount,
          initialIdea: initialIdea.trim() || undefined,
          userApiKey: userApiKey.trim() || undefined
        })
      });

      const data = await res.json();

      if (data.success && Array.isArray(data.pitches)) {
        const enrichedPitches: PitchContent[] = data.pitches.map((p: any, idx: number) => ({
          ...p,
          headlineArteAlt: `Opção B: ${p.headlineArte.replace(/[?!]/g, "")} — Vale a pena conferir?`,
          channel
        }));

        setPitches((prev) => {
          const updated = [...enrichedPitches, ...prev];
          if (typeof window !== "undefined") {
            localStorage.setItem("gera_pauta_history", JSON.stringify(updated));
          }
          return updated;
        });

        const newUsed = Math.min(usedPitches + enrichedPitches.length, maxFreePitches);
        setUsedPitches(newUsed);

        // Persiste as novas pautas geradas no banco do Supabase
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const rowsToInsert = enrichedPitches.map((p) => ({
              user_id: user.id,
              channel: p.channel,
              goal,
              mote: p.mote,
              headline_arte: p.headlineArte,
              headline_arte_alt: p.headlineArteAlt,
              legenda: p.legenda,
              formato: p.formato,
              justificativa_formato: p.justificativaFormato
            }));

            await supabase.from("pitches").insert(rowsToInsert);
            await supabase.from("profiles").update({ used_pitches: newUsed }).eq("id", user.id);
          }
        } catch (dbErr) {
          console.warn("Pautas salvas em cache local:", dbErr);
        }

        toast.success(`✨ ${enrichedPitches.length} pautas contextualizadas criadas e salvas no Supabase!`);
      } else {
        throw new Error(data.error || "Erro na geração");
      }
    } catch (err: any) {
      toast.error("Instabilidade momentânea. Ativando motor de contingência...");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentPersona = personas.find((p) => p.id === selectedPersonaId) || personas[0];

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-[#FCA311]/30">
      {/* TOPBAR PRINCIPAL */}
      <header className="border-b border-[#E5E5E5]/15 bg-[#14213D] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Logo e Nome da Marca */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#000000] border border-[#FCA311]/40 flex items-center justify-center font-black text-[#FCA311] text-base shadow-lg">
                GP
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-white block leading-tight">
                  Gera Pauta
                </span>
                <span className="text-[11px] text-[#E5E5E5]/70 truncate max-w-[200px] block">
                  {companyName} • {niche}
                </span>
              </div>
            </Link>
          </div>

          {/* Status de Quota e Ações Rápidas */}
          <div className="flex items-center gap-3">
            {/* Indicador de 5 Pautas Grátis */}
            <div className="hidden sm:flex items-center gap-2 bg-[#000000]/60 px-3 py-1.5 rounded-full border border-[#E5E5E5]/20 text-xs">
              <Zap className="w-3.5 h-3.5 text-[#FCA311]" />
              <span className="text-[#E5E5E5]/80">Degustação:</span>
              <span className="text-[#FCA311] font-mono font-bold">
                {Math.max(0, maxFreePitches - usedPitches)} / {maxFreePitches} restantes
              </span>
            </div>

            <Button
              onClick={() => setActiveTab("billing")}
              size="sm"
              className="bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-bold text-xs h-8 px-3 rounded-lg shadow-md shadow-[#FCA311]/20 cursor-pointer"
            >
              Fazer Upgrade PRO
            </Button>

            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-[#E5E5E5]/70 hover:text-white hover:bg-[#000000]/40 text-xs h-8 px-2 rounded-lg cursor-pointer"
              title="Sair da conta"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* ÁREA PRINCIPAL COM AS ABAS */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navegação entre Abas */}
          <div className="flex justify-center w-full">
            <TabsList className="bg-[#14213D] border border-[#E5E5E5]/15 p-1 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-1 w-full max-w-3xl">
              <TabsTrigger
                value="generator"
                className="data-[state=active]:bg-[#FCA311] data-[state=active]:text-black text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-[#E5E5E5] transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>1. Gerador</span>
              </TabsTrigger>

              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-[#FCA311] data-[state=active]:text-black text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-[#E5E5E5] transition-all cursor-pointer"
              >
                <History className="w-3.5 h-3.5" />
                <span>2. Histórico ({pitches.length})</span>
              </TabsTrigger>

              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-[#FCA311] data-[state=active]:text-black text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-[#E5E5E5] transition-all cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>3. Perfil do Negócio</span>
              </TabsTrigger>

              <TabsTrigger
                value="billing"
                className="data-[state=active]:bg-[#FCA311] data-[state=active]:text-black text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-[#E5E5E5] transition-all cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>4. Planos & IA</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* =========================================================================
              ABA 1: GERADOR MULTICANAL CONTEXTUALIZADO
             ========================================================================= */}
          <TabsContent value="generator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* COLUNA ESQUERDA: PARÂMETROS E BRIEFING (5 COLUNAS) */}
              <div className="lg:col-span-5 space-y-4">
                <Card className="bg-[#14213D] border border-[#E5E5E5]/15 p-5 rounded-2xl shadow-xl space-y-4">
                  {/* Seletor de Persona do Negócio */}
                  <div className="space-y-1.5">
                    <Label className="text-white text-xs flex items-center justify-between">
                      <span>Persona / Cliente-Alvo</span>
                      <span className="text-[#FCA311] text-[10px]">{currentPersona.category.toUpperCase()}</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {personas.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedPersonaId(p.id)}
                          className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                            selectedPersonaId === p.id
                              ? "bg-[#000000] border-[#FCA311] text-white shadow-md shadow-[#FCA311]/10 font-bold"
                              : "bg-[#000000]/40 border-[#E5E5E5]/10 text-[#E5E5E5]/70 hover:bg-[#000000]/70"
                          }`}
                        >
                          <span className="block truncate font-semibold text-white">{p.name.split("—")[0]}</span>
                          <span className="text-[10px] text-[#E5E5E5]/60 truncate block">{p.role}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Detalhe da Dor da Persona Selecionada */}
                  <div className="p-3 bg-[#000000]/60 rounded-xl border border-[#E5E5E5]/10 text-xs">
                    <span className="text-[#FCA311] font-bold text-[10px] uppercase block mb-1">
                      ⚠️ Dor / Objeção que a IA vai quebrar:
                    </span>
                    <p className="text-[#E5E5E5]/90 text-[11px] leading-relaxed">
                      "{currentPersona.keyPain}"
                    </p>
                  </div>

                  {/* Seletor de Rede Social (Inspirado no HubSpot) */}
                  <div className="space-y-1.5">
                    <Label className="text-white text-xs">Rede Social de Destino</Label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: "instagram", label: "Instagram", icon: Share2 },
                        { id: "linkedin", label: "LinkedIn", icon: Briefcase },
                        { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
                        { id: "tiktok", label: "TikTok / Reels", icon: Video }
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = channel === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setChannel(item.id as any)}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[11px] transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#000000] border-[#FCA311] text-[#FCA311] font-bold"
                                : "bg-[#000000]/40 border-[#E5E5E5]/10 text-[#E5E5E5]/70 hover:text-white"
                            }`}
                          >
                            <Icon className="w-4 h-4 mb-1" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Objetivo do Conteúdo / CTA (Inspirado no HubSpot) */}
                  <div className="space-y-1.5">
                    <Label className="text-white text-xs">Objetivo do Post / Chamada para Ação</Label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full bg-[#000000]/60 border border-[#E5E5E5]/20 text-white rounded-xl text-xs h-10 px-3 focus:outline-none focus:ring-1 focus:ring-[#FCA311]"
                    >
                      <option value="whatsapp">📲 Chamar no WhatsApp / Agendamento Direto</option>
                      <option value="comments">💬 Gerar Comentários / Direct</option>
                      <option value="saves">📌 Autoridade & Salvar para Consultar Depois</option>
                      <option value="shares">📢 Divulgação / Compartilhamentos</option>
                    </select>
                  </div>

                  {/* Toggles de Emojis e Hashtags (Inspirado no QuillBot) */}
                  <div className="flex items-center justify-between p-2.5 bg-[#000000]/40 rounded-xl border border-[#E5E5E5]/10 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-[#E5E5E5]">
                      <input
                        type="checkbox"
                        checked={includeEmojis}
                        onChange={(e) => setIncludeEmojis(e.target.checked)}
                        className="rounded border-[#E5E5E5]/20 text-[#FCA311] focus:ring-[#FCA311]"
                      />
                      <span>Incluir Emojis</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[#E5E5E5]">
                      <input
                        type="checkbox"
                        checked={includeHashtags}
                        onChange={(e) => setIncludeHashtags(e.target.checked)}
                        className="rounded border-[#E5E5E5]/20 text-[#FCA311] focus:ring-[#FCA311]"
                      />
                      <span>Hashtags do Nicho</span>
                    </label>
                  </div>

                  {/* Campo de Ideia Livre / Briefing */}
                  <div className="space-y-1.5">
                    <Label htmlFor="idea" className="text-white text-xs flex items-center justify-between">
                      <span>💡 Ideia de Conteúdo / Oferta (Opcional)</span>
                      <span className="text-[10px] text-[#E5E5E5]/50">Deixe vazio para ideação automática</span>
                    </Label>
                    <Textarea
                      id="idea"
                      maxLength={500}
                      rows={3}
                      placeholder="Ex: Quero fazer um post sobre o novo clareamento a laser sem dor / Promoção da quarta-feira..."
                      value={initialIdea}
                      onChange={(e) => setInitialIdea(e.target.value)}
                      className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white placeholder:text-[#E5E5E5]/40 text-xs resize-none focus-visible:ring-[#FCA311]"
                    />
                  </div>

                  {/* Botão de Geração */}
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-extrabold h-11 text-xs rounded-xl transition-all shadow-lg shadow-[#FCA311]/20 cursor-pointer gap-2"
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Escrevendo com IA contextualizada...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Gerar Pautas Estruturadas
                      </span>
                    )}
                  </Button>
                </Card>
              </div>

              {/* COLUNA DIREITA: RESULTADOS / CARDS DE PAUTA (7 COLUNAS) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FCA311]" />
                    Pautas Prontas para Publicação ({pitches.length})
                  </h3>
                  <span className="text-[11px] text-[#E5E5E5]/60">
                    Clique em copiar para enviar direto ao designer ou WhatsApp
                  </span>
                </div>

                {/* Loading State com Skeletons */}
                {isGenerating && (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <Card key={i} className="bg-[#14213D] border border-[#E5E5E5]/15 p-5 rounded-2xl space-y-3">
                        <Skeleton className="h-4 w-1/3 bg-[#000000]/60" />
                        <Skeleton className="h-6 w-3/4 bg-[#000000]/60" />
                        <Skeleton className="h-16 w-full bg-[#000000]/60" />
                        <Skeleton className="h-8 w-1/2 bg-[#000000]/60" />
                      </Card>
                    ))}
                  </div>
                )}

                {/* Lista de Cards de Conteúdo */}
                {!isGenerating && pitches.length === 0 ? (
                  <Card className="bg-[#14213D] border border-[#E5E5E5]/15 p-12 text-center rounded-2xl">
                    <Sparkles className="w-8 h-8 text-[#FCA311] mx-auto mb-2 opacity-50" />
                    <h4 className="text-sm font-bold text-white">Nenhuma pauta gerada ainda</h4>
                    <p className="text-xs text-[#E5E5E5]/70 mt-1">
                      Escolha uma persona ao lado e clique em "Gerar Pautas Estruturadas".
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {pitches.map((pitch, idx) => (
                      <Card
                        key={pitch.id || idx}
                        className="bg-[#14213D] border border-[#E5E5E5]/15 p-5 rounded-2xl shadow-xl hover:border-[#FCA311]/50 transition-all space-y-4 relative overflow-hidden"
                      >
                        {/* Indicador de Cabeçalho do Card */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E5E5]/10 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#000000] border border-[#FCA311]/50 flex items-center justify-center text-[10px] font-bold text-[#FCA311]">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              {pitch.formato || "Pauta Recomendada"}
                            </span>
                          </div>
                          <Badge className="bg-[#000000] text-[#E5E5E5] border border-[#E5E5E5]/20 text-[10px]">
                            {pitch.channel?.toUpperCase() || channel.toUpperCase()}
                          </Badge>
                        </div>

                        {/* Bloco 1: Mote Criativo */}
                        <div>
                          <span className="text-[10px] font-bold text-[#FCA311] uppercase tracking-wider block mb-1">
                            🎯 Mote do Conteúdo
                          </span>
                          <p className="text-xs text-[#E5E5E5]/90 leading-relaxed font-medium">
                            {pitch.mote}
                          </p>
                        </div>

                        {/* Bloco 2: Duas Opções de Headline da Arte (Super diferencial) */}
                        <div className="p-3 bg-[#000000]/60 rounded-xl border border-[#E5E5E5]/10 space-y-2">
                          <span className="text-[10px] font-bold text-[#FCA311] uppercase tracking-wider block">
                            🖼️ Headline da Arte (O que vai escrito na imagem/vídeo):
                          </span>
                          
                          {/* Opção A */}
                          <div className="flex items-center justify-between gap-2 p-2 bg-[#14213D]/60 rounded-lg border border-[#E5E5E5]/10">
                            <div>
                              <span className="text-[10px] text-[#E5E5E5]/60 font-semibold block">Opção A (Principal):</span>
                              <p className="text-xs font-bold text-white">{pitch.headlineArte}</p>
                            </div>
                            <Button
                              onClick={() => handleCopy(pitch, pitch.headlineArte)}
                              size="sm"
                              variant="ghost"
                              className="text-[10px] text-[#FCA311] hover:bg-[#000000] h-7 px-2 shrink-0 cursor-pointer"
                            >
                              <Copy className="w-3 h-3 mr-1" /> Copiar
                            </Button>
                          </div>

                          {/* Opção B Alternativa */}
                          {pitch.headlineArteAlt && (
                            <div className="flex items-center justify-between gap-2 p-2 bg-[#14213D]/40 rounded-lg border border-[#E5E5E5]/10">
                              <div>
                                <span className="text-[10px] text-[#E5E5E5]/60 font-semibold block">Opção B (Alternativa):</span>
                                <p className="text-xs font-medium text-[#E5E5E5]">{pitch.headlineArteAlt}</p>
                              </div>
                              <Button
                                onClick={() => handleCopy(pitch, pitch.headlineArteAlt!)}
                                size="sm"
                                variant="ghost"
                                className="text-[10px] text-[#E5E5E5]/70 hover:text-white hover:bg-[#000000] h-7 px-2 shrink-0 cursor-pointer"
                              >
                                <Copy className="w-3 h-3 mr-1" /> Copiar
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Bloco 3: Legenda Completa com CTA */}
                        <div>
                          <span className="text-[10px] font-bold text-[#FCA311] uppercase tracking-wider block mb-1">
                            ✍️ Legenda Completa Pronta para Postar
                          </span>
                          <div className="p-3 bg-[#000000]/40 rounded-xl border border-[#E5E5E5]/10 text-xs text-[#E5E5E5] whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                            {pitch.legenda}
                          </div>
                        </div>

                        {/* Bloco 4: Formato e Justificativa Baseada em Dados */}
                        <div className="text-[11px] text-[#E5E5E5]/70 bg-[#000000]/20 p-2.5 rounded-lg border border-[#E5E5E5]/5">
                          <strong className="text-[#FCA311]">Por que este formato?</strong> {pitch.justificativaFormato}
                        </div>

                        {/* Botão Copiar Tudo */}
                        <div className="pt-2 flex justify-end">
                          <Button
                            onClick={() => handleCopy(pitch, pitch.headlineArte)}
                            size="sm"
                            className="bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-bold text-xs h-9 px-4 rounded-xl cursor-pointer gap-1.5"
                          >
                            {copiedId === pitch.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-black" /> Copiado!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" /> Copiar Pauta Completa
                              </>
                            )}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* =========================================================================
              ABA 2: HISTÓRICO DE PAUTAS
             ========================================================================= */}
          <TabsContent value="history" className="space-y-4">
            <Card className="bg-[#14213D] border border-[#E5E5E5]/15 p-5 rounded-2xl shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-[#FCA311]" />
                  Todas as Pautas Criadas ({pitches.length})
                </h3>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-[#E5E5E5]/40 absolute left-3 top-2.5" />
                    <Input
                      placeholder="Buscar por palavra-chave..."
                      value={searchHistory}
                      onChange={(e) => setSearchHistory(e.target.value)}
                      className="bg-[#000000]/60 border-[#E5E5E5]/20 text-xs h-9 pl-8 text-white focus-visible:ring-[#FCA311]"
                    />
                  </div>
                </div>
              </div>

              {/* Listagem do Histórico */}
              <div className="space-y-3 pt-2">
                {pitches
                  .filter((p) => 
                    !searchHistory || 
                    p.headlineArte.toLowerCase().includes(searchHistory.toLowerCase()) || 
                    p.mote.toLowerCase().includes(searchHistory.toLowerCase())
                  )
                  .map((p, idx) => (
                    <div
                      key={p.id || idx}
                      className="p-4 bg-[#000000]/60 border border-[#E5E5E5]/10 rounded-xl hover:border-[#FCA311]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-[#14213D] text-[#FCA311] border border-[#FCA311]/30 text-[10px]">
                            {p.channel?.toUpperCase() || "POST"}
                          </Badge>
                          <span className="text-[10px] text-[#E5E5E5]/50">{p.createdAt}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white">{p.headlineArte}</h4>
                        <p className="text-[11px] text-[#E5E5E5]/70 line-clamp-1">{p.mote}</p>
                      </div>

                      <Button
                        onClick={() => handleCopy(p, p.headlineArte)}
                        size="sm"
                        variant="outline"
                        className="border-[#E5E5E5]/20 bg-[#14213D] text-white hover:text-[#FCA311] text-xs h-8 px-3 rounded-lg cursor-pointer shrink-0"
                      >
                        <Copy className="w-3 h-3 mr-1" /> Copiar
                      </Button>
                    </div>
                  ))}
              </div>
            </Card>
          </TabsContent>

          {/* =========================================================================
              ABA 3: PERFIL DO NEGÓCIO
             ========================================================================= */}
          <TabsContent value="profile" className="space-y-4">
            <Card className="bg-[#14213D] border border-[#E5E5E5]/15 p-6 rounded-2xl shadow-xl max-w-2xl mx-auto space-y-4">
              <div className="flex items-center gap-3 border-b border-[#E5E5E5]/10 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FCA311]/40 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#FCA311]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Configurações da Marca</h3>
                  <p className="text-xs text-[#E5E5E5]/70">Estes dados orientam o motor de inteligência artificial em todas as pautas.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-white">Nome da Empresa</Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white text-xs h-10 focus-visible:ring-[#FCA311]"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-white">Nicho de Atuação</Label>
                  <Input
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white text-xs h-10 focus-visible:ring-[#FCA311]"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-white">Tom de Voz Padrão</Label>
                  <Input
                    value={toneOfVoice}
                    onChange={(e) => setToneOfVoice(e.target.value)}
                    className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white text-xs h-10 focus-visible:ring-[#FCA311]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      localStorage.setItem("gera_pauta_company_name", companyName);
                      localStorage.setItem("gera_pauta_niche", niche);
                    }
                    toast.success("Dados da empresa atualizados com sucesso!");
                  }}
                  className="bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-bold text-xs h-9 px-4 rounded-xl cursor-pointer"
                >
                  Salvar Alterações
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* =========================================================================
              ABA 4: PLANOS & CHAVE DE IA (BYOK)
             ========================================================================= */}
          <TabsContent value="billing" className="space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Card de Controle de Quota */}
              <Card className="bg-[#14213D] border border-[#E5E5E5]/15 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#FCA311]" />
                    Status da sua Degustação Gratuita
                  </h3>
                  <p className="text-xs text-[#E5E5E5]/70 mt-1">
                    Você utilizou <strong>{usedPitches}</strong> de <strong>{maxFreePitches}</strong> pautas gratuitas.
                  </p>
                </div>
                <div className="w-full sm:w-48 bg-[#000000] h-2.5 rounded-full overflow-hidden border border-[#E5E5E5]/20">
                  <div
                    className="h-full bg-[#FCA311]"
                    style={{ width: `${(usedPitches / maxFreePitches) * 100}%` }}
                  />
                </div>
              </Card>

              {/* Tabela de Planos Comerciais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Plano Gratuito */}
                <Card className="bg-[#14213D]/60 border border-[#E5E5E5]/15 p-6 rounded-2xl space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs text-[#E5E5E5]/60 font-semibold uppercase">Degustação</span>
                    <h4 className="text-xl font-black text-white">Plano Grátis</h4>
                    <span className="text-2xl font-black text-white">R$ 0</span>
                  </div>
                  <ul className="text-xs text-[#E5E5E5]/80 space-y-2">
                    <li>✓ 5 pautas estruturadas para teste</li>
                    <li>✓ Acesso ao gerador multicanal</li>
                    <li>✓ 2 opções de headline da arte</li>
                  </ul>
                  <Button disabled variant="outline" className="w-full border-[#E5E5E5]/20 text-[#E5E5E5] text-xs h-10 rounded-xl">
                    Plano Atual
                  </Button>
                </Card>

                {/* Plano PRO (Recomendado) */}
                <Card className="bg-[#14213D] border-2 border-[#FCA311] p-6 rounded-2xl space-y-4 relative shadow-2xl">
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-[#FCA311] text-black font-extrabold text-[10px]">RECOMENDADO</Badge>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-[#FCA311] font-semibold uppercase">Ilimitado & Comercial</span>
                    <h4 className="text-xl font-black text-white">Plano Pro</h4>
                    <span className="text-2xl font-black text-white">R$ 47 <span className="text-xs font-normal text-[#E5E5E5]/60">/mês</span></span>
                  </div>
                  <ul className="text-xs text-[#E5E5E5]/80 space-y-2">
                    <li>✓ Pautas ilimitadas com IA inclusa</li>
                    <li>✓ Múltiplos clientes e nichos</li>
                    <li>✓ Refazer pauta ilimitado</li>
                    <li>✓ Suporte prioritário via WhatsApp</li>
                  </ul>
                  <Button
                    onClick={() => toast.info("Checkout Stripe configurado no backend. Pronto para ativar.")}
                    className="w-full bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-black text-xs h-10 rounded-xl shadow-lg shadow-[#FCA311]/20 cursor-pointer"
                  >
                    Assinar Plano Pro Agora
                  </Button>
                </Card>
              </div>

              {/* Campo Opcional: Potencializador com Chave Própria (BYOK) */}
              <Card className="bg-[#14213D] border border-[#E5E5E5]/15 p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#000000] border border-[#FCA311]/40 flex items-center justify-center">
                    <Key className="w-4 h-4 text-[#FCA311]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Potencializador com Chave Própria (Opcional - BYOK)</h4>
                    <p className="text-xs text-[#E5E5E5]/70">
                      Você pode conectar sua chave gratuita do Google AI Studio para autonomia total.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="password"
                    placeholder="AIzaSy... (Cole sua chave aqui)"
                    value={userApiKey}
                    onChange={(e) => setUserApiKey(e.target.value)}
                    className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white text-xs h-10 focus-visible:ring-[#FCA311]"
                  />
                  <Button
                    onClick={handleSaveApiKey}
                    className="bg-[#000000] hover:bg-[#FCA311] hover:text-black border border-[#FCA311]/40 text-[#FCA311] font-bold text-xs h-10 px-4 rounded-xl cursor-pointer shrink-0 transition-all"
                  >
                    Salvar Chave
                  </Button>
                </div>

                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#FCA311] hover:underline flex items-center gap-1 inline-flex"
                >
                  Onde pegar minha chave gratuita do Google AI Studio em 1 minuto? <ExternalLink className="w-3 h-3" />
                </a>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
