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
  Filter,
  Wand2,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Trash2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { INITIAL_PERSONAS, INITIAL_PITCHES, PersonaData, PitchContent } from "@/data/mockData";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("generator");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Contexto do Negócio (Memória de Marca)
  const [companyName, setCompanyName] = useState("Clínica Sorriso & Bem-Estar");
  const [niche, setNiche] = useState("Odontologia Estética");
  const [toneOfVoice, setToneOfVoice] = useState("Profissional, acolhedor e empático");
  const [keyPain, setKeyPain] = useState("Medo de procedimentos dolorosos e tratamentos artificiais");
  const [differential, setDifferential] = useState("Tecnologia a laser sem dor e atendimento humanizado pontual");
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

  // Controle de Quota e Chave BYOK (Feature 4 - Controle de Quota Gratuita)
  const [usedPitches, setUsedPitches] = useState<number>(1);
  const maxFreePitches = 5;
  const [userApiKey, setUserApiKey] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [hasByok, setHasByok] = useState<boolean>(false);
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState<boolean>(false);

  // Feature 3: Estado de Refinamento / Ajuste Individual de Pauta
  const [refiningPitchId, setRefiningPitchId] = useState<string | null>(null);
  const [refineInstruction, setRefineInstruction] = useState<string>("");
  const [isRefining, setIsRefining] = useState<boolean>(false);

  // Feature 5: Estados da Chave de IA do Usuário (BYOK)
  const [apiKeyInput, setApiKeyInput] = useState<string>("");
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isTestingApiKey, setIsTestingApiKey] = useState<boolean>(false);
  const [isSavingApiKey, setIsSavingApiKey] = useState<boolean>(false);
  const [isDisconnectingKey, setIsDisconnectingKey] = useState<boolean>(false);
  const [savedMaskedKey, setSavedMaskedKey] = useState<string | null>(null);
  const [testSuccessInfo, setTestSuccessInfo] = useState<{ latencyMs: number; model: string } | null>(null);

  // Helper em Tempo Real: Aplica os toggles de Emojis e Hashtags instantaneamente na legenda
  const getFormattedLegenda = (rawLegenda: string, showEmojis: boolean, showHashtags: boolean): string => {
    let text = rawLegenda || "";
    if (!showEmojis) {
      // Remove emojis preservando a pontuação e acentuação da língua portuguesa
      text = text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, "").trim();
    }
    if (!showHashtags) {
      // Remove bloco final de hashtags se desativado
      text = text.replace(/\n*#\S+(\s+#\S+)*/g, "").trim();
    }
    return text;
  };

  // Cópia individual com feedback
  const handleCopyText = (label: string, text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`✨ ${label} copiado com sucesso!`);
  };

  // Cópia da Pauta Completa com formatação profissional
  const handleCopyFullPitch = (pitch: PitchContent, headlineToCopy: string) => {
    const finalLegenda = getFormattedLegenda(pitch.legenda, includeEmojis, includeHashtags);
    const textToCopy = `🎯 MOTE ESTRATÉGICO:\n${pitch.mote}\n\n🖼️ HEADLINE DA ARTE (OPÇÃO SELECIONADA):\n${headlineToCopy}\n\n${pitch.headlineArteAlt ? `🖼️ HEADLINE ALTERNATIVA:\n${pitch.headlineArteAlt}\n\n` : ""}✍️ LEGENDA:\n${finalLegenda}\n\n📐 FORMATO RECOMENDADO:\n${pitch.formato} — ${pitch.justificativaFormato}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(pitch.id);
    toast.success("✨ Pauta completa copiada para a área de transferência!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Feature 3: Executa o refinamento / ajuste da pauta individual via API /api/refine
  const handleRefineSubmit = async (pitch: PitchContent) => {
    const cleanInstruction = refineInstruction.trim();
    if (!cleanInstruction || cleanInstruction.length < 3) {
      toast.error("Por favor, digite pelo menos 3 caracteres indicando o que deseja ajustar.");
      return;
    }

    setIsRefining(true);
    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pitchId: pitch.id,
          pitch,
          instruction: cleanInstruction,
          channel,
          includeEmojis,
          includeHashtags,
          userApiKey: userApiKey.trim() || undefined,
          businessContext: {
            companyName,
            niche,
            toneOfVoice,
            keyPain,
            differential
          }
        })
      });

      const data = await res.json();
      if (data.success && data.pitch) {
        setPitches((prev) => {
          const updated = prev.map((p) => (p.id === pitch.id ? data.pitch : p));
          if (typeof window !== "undefined") {
            localStorage.setItem("gera_pauta_history", JSON.stringify(updated));
          }
          return updated;
        });

        toast.success(data.message || `✨ Pauta ajustada com sucesso para a versão v${data.pitch.version}!`);
        setRefiningPitchId(null);
        setRefineInstruction("");
      } else {
        throw new Error(data.error || "Não foi possível ajustar a pauta.");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro de conexão ao ajustar pauta.");
    } finally {
      setIsRefining(false);
    }
  };

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
            setIsPro(profile.is_pro === true);
            if (profile.user_api_key) setUserApiKey(profile.user_api_key);
          }

          // 1.1 Sincroniza quota e status PRO via endpoint do servidor
          try {
            const quotaRes = await fetch("/api/quota");
            if (quotaRes.ok) {
              const quotaData = await quotaRes.json();
              if (quotaData.success && quotaData.quota) {
                if (quotaData.quota.isPro) setIsPro(true);
                if (typeof quotaData.quota.usedPitches === "number") {
                  setUsedPitches(quotaData.quota.usedPitches);
                }
              }
            }
          } catch (qErr) {
            console.warn("Erro ao sincronizar quota:", qErr);
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
            if (business.key_pain) setKeyPain(business.key_pain);
            if (business.differential) setDifferential(business.differential);
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

          // 4. Carrega Status da Chave de IA (BYOK - Feature 5)
          try {
            const byokRes = await fetch("/api/byok");
            const byokData = await byokRes.json();
            if (byokData.success && byokData.hasKey) {
              setSavedMaskedKey(byokData.maskedKey);
              setHasByok(true);
            }
          } catch {}
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

  // Função para resetar saldo de testes via API /api/quota (Modo Desenvolvedor)
  const handleResetQuota = async () => {
    try {
      const res = await fetch("/api/quota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "manual_dev_reset" })
      });
      const data = await res.json();
      if (data.success) {
        setUsedPitches(0);
        setIsQuotaModalOpen(false);
        toast.success("✨ Saldo de degustação restaurado (5 pautas liberadas) para você continuar testando!");
        return;
      }
    } catch {}
    setUsedPitches(0);
    setIsQuotaModalOpen(false);
    toast.success("✨ Saldo restaurado no cliente para testes!");
  };

  // Feature 5: Teste de Conexão com 1 Clique
  const handleTestApiKey = async () => {
    const keyToTest = apiKeyInput.trim();
    if (!keyToTest || keyToTest.length < 15) {
      toast.error("Por favor, cole uma chave válida do Google AI Studio para testar.");
      return;
    }

    setIsTestingApiKey(true);
    setTestSuccessInfo(null);
    try {
      const res = await fetch("/api/byok/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: keyToTest, provider: "gemini" })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Chave inválida. Verifique os caracteres no Google AI Studio.");
        return;
      }

      setTestSuccessInfo({ latencyMs: data.latencyMs, model: data.model });
      toast.success(`✨ Conexão bem-sucedida com Google AI Studio! (${data.latencyMs}ms)`);
    } catch {
      toast.error("Erro de conexão ao testar a chave. Verifique sua internet.");
    } finally {
      setIsTestingApiKey(false);
    }
  };

  // Feature 5: Salvar Chave Criptografada no Banco
  const handleSaveApiKey = async () => {
    const keyToSave = apiKeyInput.trim();
    if (!keyToSave || keyToSave.length < 15) {
      toast.error("Por favor, cole sua chave do Google AI Studio.");
      return;
    }

    setIsSavingApiKey(true);
    try {
      const res = await fetch("/api/byok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: keyToSave, provider: "gemini" })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Falha ao salvar a chave no banco.");
        return;
      }

      setSavedMaskedKey(data.maskedKey);
      setHasByok(true);
      setUserApiKey(keyToSave);
      setApiKeyInput("");
      setTestSuccessInfo(null);
      toast.success("✨ Chave do Google AI Studio salva e criptografada com sucesso! Potencializador Ilimitado ativado.");
    } catch {
      toast.error("Erro de conexão ao salvar a chave.");
    } finally {
      setIsSavingApiKey(false);
    }
  };

  // Feature 5: Desconectar Chave
  const handleDisconnectKey = async () => {
    setIsDisconnectingKey(true);
    try {
      const res = await fetch("/api/byok", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSavedMaskedKey(null);
        setHasByok(false);
        setUserApiKey("");
        setTestSuccessInfo(null);
        toast.success("Chave de IA desconectada. O sistema voltou ao plano padrão.");
      } else {
        toast.error(data.error || "Erro ao desconectar chave.");
      }
    } catch {
      toast.error("Erro de conexão ao desconectar chave.");
    } finally {
      setIsDisconnectingKey(false);
    }
  };

  // Feature 6: Iniciar Checkout da Assinatura (Stripe / Sandbox)
  const [isStartingCheckout, setIsStartingCheckout] = useState<boolean>(false);
  const [isLoadingPortal, setIsLoadingPortal] = useState<boolean>(false);

  const handleStartCheckout = async () => {
    setIsStartingCheckout(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: "pro_monthly" })
      });
      const data = await res.json();
      if (data.url) {
        toast.success("Redirecionando para o checkout seguro...");
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Não foi possível conectar com o checkout.");
      }
    } catch {
      toast.error("Erro ao iniciar processo de assinatura.");
    } finally {
      setIsStartingCheckout(false);
    }
  };

  // Feature 6.1: Gerenciar ou Cancelar Assinatura via Stripe Customer Portal
  const handleOpenCustomerPortal = async () => {
    setIsLoadingPortal(true);
    try {
      const res = await fetch("/api/checkout/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.url) {
        toast.success("Abrindo portal de gerenciamento da sua assinatura...");
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Não foi possível abrir o portal da assinatura.");
      }
    } catch {
      toast.error("Erro ao conectar ao portal da assinatura.");
    } finally {
      setIsLoadingPortal(false);
    }
  };

  // Feature 6.2: Cancelamento Direto no App (Sem depender de redirecionamento externo)
  const [isCancellingSub, setIsCancellingSub] = useState<boolean>(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState<boolean>(false);

  const handleCancelSubscription = async () => {
    setIsCancellingSub(true);
    try {
      const res = await fetch("/api/checkout/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsPro(false);
        setIsCancelDialogOpen(false);
        toast.success(data.message || "Assinatura cancelada com sucesso!");
      } else {
        toast.error(data.error || "Erro ao processar cancelamento.");
      }
    } catch {
      toast.error("Erro de conexão ao processar cancelamento.");
    } finally {
      setIsCancellingSub(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await supabase.auth.signOut();
    } catch {}
    toast.success("Você saiu da sua conta.");
    router.push("/login");
    router.refresh();
  };

  const handleGenerate = async () => {
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
          goal,
          includeEmojis,
          includeHashtags,
          pitchCount,
          initialIdea: initialIdea.trim() || undefined,
          userApiKey: userApiKey.trim() || undefined,
          businessContext: {
            companyName,
            niche,
            toneOfVoice,
            keyPain,
            differential
          }
        })
      });

      const data = await res.json();

      // Feature 4: Bloqueio Seguro no Backend por Quota Excedida
      if (res.status === 403 || data.code === "QUOTA_EXCEEDED") {
        setUsedPitches(maxFreePitches);
        setIsQuotaModalOpen(true);
        toast.error("Você atingiu o limite de 5 pautas gratuitas! Faça upgrade para o Plano Pro ou conecte sua chave de IA.");
        return;
      }

      if (data.success && Array.isArray(data.pitches)) {
        const enrichedPitches: PitchContent[] = data.pitches.map((p: any) => ({
          ...p,
          channel: p.channel || channel,
          headlineArteAlt: p.headlineArteAlt || `Opção B: ${p.headlineArte.replace(/[?!]/g, "")} — Vale a pena conferir?`
        }));

        setPitches((prev) => {
          const updated = [...enrichedPitches, ...prev];
          if (typeof window !== "undefined") {
            localStorage.setItem("gera_pauta_history", JSON.stringify(updated));
          }
          return updated;
        });

        // Atualiza a quota retornada diretamente pelo servidor
        const newUsed = data.quota?.usedPitches ?? Math.min(usedPitches + enrichedPitches.length, maxFreePitches);
        setUsedPitches(newUsed);

        // Se atingiu o limite das 5 pautas, abre o modal de planos conforme o PRD
        if (newUsed >= maxFreePitches && !isPro && !hasByok && !userApiKey.trim()) {
          setIsQuotaModalOpen(true);
        }

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
    <div className="min-h-screen bg-[#0D0C1D] text-white flex flex-col font-sans selection:bg-[#FFB020]/30">
      {/* TOPBAR PRINCIPAL */}
      <header className="border-b border-[#2A2A3A] bg-[#1E1B4B] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Logo Oficial e Nome da Marca */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <img 
                src="/images/logo.png" 
                alt="Gera Pauta" 
                className="h-8 w-auto object-contain group-hover:scale-105 transition-transform" 
              />
              <div className="hidden sm:block border-l border-[#2A2A3A] pl-3">
                <span className="text-[11px] text-slate-300 truncate max-w-[200px] block font-medium">
                  {companyName} • {niche}
                </span>
              </div>
            </Link>
          </div>

          {/* Status de Quota e Ações Rápidas */}
          <div className="flex items-center gap-3">
            {/* Indicador de 5 Pautas Grátis - Fica OCULTO para quem já é Assinante PRO */}
            {!isPro && (
              <div className="flex items-center gap-2 bg-[#0D0C1D]/80 px-3 py-1.5 rounded-full border border-[#2A2A3A] text-xs">
                <Zap className="w-3.5 h-3.5 text-[#FFB020]" />
                <span className="text-slate-300 hidden sm:inline">Degustação:</span>
                <span className="text-[#FFB020] font-mono font-bold">
                  {Math.max(0, maxFreePitches - usedPitches)} / {maxFreePitches}
                </span>

                {/* Botão de reset rápido para ambiente de testes/desenvolvimento */}
                <button
                  type="button"
                  onClick={handleResetQuota}
                  title="Resetar cota para continuar testando (Dev)"
                  className="ml-1 text-[10px] text-slate-400 hover:text-[#FFB020] underline cursor-pointer"
                >
                  (Resetar)
                </button>
              </div>
            )}

            {isPro ? (
              <div className="flex items-center gap-2">
                <Badge className="bg-[#FFB020] text-black font-black text-xs h-8 px-3 rounded-lg shadow-md flex items-center gap-1.5 border-0">
                  👑 Assinante PRO ✅
                </Badge>
                <Button
                  onClick={handleOpenCustomerPortal}
                  disabled={isLoadingPortal}
                  variant="outline"
                  size="sm"
                  className="border-[#FFB020]/40 text-[#FFB020] hover:bg-[#FFB020]/10 text-xs h-8 px-3 rounded-lg cursor-pointer flex items-center gap-1.5 font-bold"
                  title="Gerenciar assinatura, cartões ou cancelamento"
                >
                  {isLoadingPortal ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CreditCard className="w-3 h-3" />}
                  Gerenciar
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setActiveTab("billing")}
                size="sm"
                className="bg-[#FFB020] hover:bg-[#FFB020]/90 text-black font-bold text-xs h-8 px-3 rounded-lg shadow-md shadow-[#FFB020]/20 cursor-pointer"
              >
                Fazer Upgrade PRO
              </Button>
            )}

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
            <TabsList className="bg-[#1E1B4B] border border-[#E5E5E5]/15 p-1 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-1 w-full max-w-3xl">
              <TabsTrigger
                value="generator"
                className="data-[state=active]:bg-[#FFB020] data-[state=active]:text-black text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-[#E5E5E5] transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>1. Gerador</span>
              </TabsTrigger>

              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-[#FFB020] data-[state=active]:text-black text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-[#E5E5E5] transition-all cursor-pointer"
              >
                <History className="w-3.5 h-3.5" />
                <span>2. Histórico ({pitches.length})</span>
              </TabsTrigger>

              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-[#FFB020] data-[state=active]:text-black text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-[#E5E5E5] transition-all cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>3. Perfil & IA</span>
              </TabsTrigger>

              <TabsTrigger
                value="billing"
                className="data-[state=active]:bg-[#FFB020] data-[state=active]:text-black text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-[#E5E5E5] transition-all cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>4. Planos & Assinatura</span>
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
                <Card className="bg-[#1E1B4B] border border-[#E5E5E5]/15 p-5 rounded-2xl shadow-xl space-y-4">
                  {/* Seletor de Persona do Negócio */}
                  <div className="space-y-1.5">
                    <Label className="text-white text-xs flex items-center justify-between">
                      <span>Persona / Cliente-Alvo</span>
                      <span className="text-[#FFB020] text-[10px]">{currentPersona.category.toUpperCase()}</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {personas.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedPersonaId(p.id)}
                          className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                            selectedPersonaId === p.id
                              ? "bg-[#000000] border-[#FFB020] text-white shadow-md shadow-[#FFB020]/10 font-bold"
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
                    <span className="text-[#FFB020] font-bold text-[10px] uppercase block mb-1">
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
                                ? "bg-[#000000] border-[#FFB020] text-[#FFB020] font-bold"
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
                      className="w-full bg-[#000000]/60 border border-[#E5E5E5]/20 text-white rounded-xl text-xs h-10 px-3 focus:outline-none focus:ring-1 focus:ring-[#FFB020]"
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
                        className="rounded border-[#E5E5E5]/20 text-[#FFB020] focus:ring-[#FFB020]"
                      />
                      <span>Incluir Emojis</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[#E5E5E5]">
                      <input
                        type="checkbox"
                        checked={includeHashtags}
                        onChange={(e) => setIncludeHashtags(e.target.checked)}
                        className="rounded border-[#E5E5E5]/20 text-[#FFB020] focus:ring-[#FFB020]"
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
                      className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white placeholder:text-[#E5E5E5]/40 text-xs resize-none focus-visible:ring-[#FFB020]"
                    />
                  </div>

                  {/* Botão de Geração */}
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-[#FFB020] hover:bg-[#FFB020]/90 text-black font-extrabold h-11 text-xs rounded-xl transition-all shadow-lg shadow-[#FFB020]/20 cursor-pointer gap-2"
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
                    <Sparkles className="w-4 h-4 text-[#FFB020]" />
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
                      <Card key={i} className="bg-[#1E1B4B] border border-[#E5E5E5]/15 p-5 rounded-2xl space-y-3">
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
                  <Card className="bg-[#1E1B4B] border border-[#E5E5E5]/15 p-12 text-center rounded-2xl">
                    <Sparkles className="w-8 h-8 text-[#FFB020] mx-auto mb-2 opacity-50" />
                    <h4 className="text-sm font-bold text-white">Nenhuma pauta gerada ainda</h4>
                    <p className="text-xs text-[#E5E5E5]/70 mt-1">
                      Escolha uma persona ao lado e clique em "Gerar Pautas Estruturadas".
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {pitches.map((pitch, idx) => {
                      const formattedLegenda = getFormattedLegenda(pitch.legenda, includeEmojis, includeHashtags);
                      const isRefiningThis = refiningPitchId === pitch.id;

                      return (
                        <Card
                          key={pitch.id || idx}
                          className="bg-[#1E1B4B] border border-[#E5E5E5]/15 p-5 rounded-2xl shadow-xl hover:border-[#FFB020]/50 transition-all space-y-4 relative overflow-hidden"
                        >
                          {/* Indicador de Cabeçalho do Card */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E5E5]/10 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#000000] border border-[#FFB020]/50 flex items-center justify-center text-[10px] font-bold text-[#FFB020]">
                                {idx + 1}
                              </span>
                              <span className="text-xs font-bold text-white uppercase tracking-wider">
                                {pitch.formato || "Pauta Recomendada"}
                              </span>
                              {pitch.version && pitch.version > 1 && (
                                <Badge className="bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/40 text-[10px] flex items-center gap-1 font-bold">
                                  <Wand2 className="w-3 h-3" /> v{pitch.version} (Ajustada)
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Badge className="bg-[#000000] text-[#E5E5E5] border border-[#E5E5E5]/20 text-[10px] font-bold">
                                {pitch.channel?.toUpperCase() || channel.toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          {/* Bloco 1: Mote Estratégico */}
                          <div className="p-3 bg-[#000000]/40 rounded-xl border border-[#E5E5E5]/10 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-[#FFB020] uppercase tracking-wider flex items-center gap-1">
                                🎯 Bloco 1: Mote Estratégico
                              </span>
                              <Button
                                onClick={() => handleCopyText("Mote Estratégico", pitch.mote)}
                                size="sm"
                                variant="ghost"
                                className="text-[10px] text-[#E5E5E5]/70 hover:text-white hover:bg-[#000000] h-6 px-2 shrink-0 cursor-pointer"
                              >
                                <Copy className="w-3 h-3 mr-1" /> Copiar Mote
                              </Button>
                            </div>
                            <p className="text-xs text-[#E5E5E5]/90 leading-relaxed font-medium">
                              {pitch.mote}
                            </p>
                          </div>

                          {/* Bloco 2: Duas Opções de Headline da Arte */}
                          <div className="p-3.5 bg-[#000000]/60 rounded-xl border border-[#E5E5E5]/10 space-y-2.5">
                            <span className="text-[10px] font-bold text-[#FFB020] uppercase tracking-wider block">
                              🖼️ Bloco 2: Duas Opções de Headline da Arte (O que vai escrito na imagem/vídeo):
                            </span>
                            
                            {/* Opção A: Pergunta Provocativa / Gancho de Curiosidade */}
                            <div className="flex items-center justify-between gap-2 p-2.5 bg-[#1E1B4B]/70 rounded-lg border border-[#E5E5E5]/15">
                              <div className="flex-1 pr-2">
                                <span className="text-[10px] text-[#FFB020] font-bold block mb-0.5">
                                  Opção 1 (Pergunta Provocativa / Gancho de Curiosidade):
                                </span>
                                <p className="text-xs font-bold text-white leading-snug">{pitch.headlineArte}</p>
                              </div>
                              <Button
                                onClick={() => handleCopyText("Opção 1 da Headline", pitch.headlineArte)}
                                size="sm"
                                variant="ghost"
                                className="text-[10px] text-[#FFB020] hover:bg-[#000000] h-7 px-2 shrink-0 cursor-pointer"
                              >
                                <Copy className="w-3 h-3 mr-1" /> Copiar
                              </Button>
                            </div>

                            {/* Opção B: Afirmação de Impacto / Posicionamento */}
                            <div className="flex items-center justify-between gap-2 p-2.5 bg-[#1E1B4B]/40 rounded-lg border border-[#E5E5E5]/10">
                              <div className="flex-1 pr-2">
                                <span className="text-[10px] text-[#E5E5E5]/70 font-semibold block mb-0.5">
                                  Opção 2 (Afirmação de Impacto / Posicionamento de Autoridade):
                                </span>
                                <p className="text-xs font-medium text-[#E5E5E5] leading-snug">
                                  {pitch.headlineArteAlt || `Opção B: ${pitch.headlineArte.replace(/[?!]/g, "")} — Vale a pena conferir?`}
                                </p>
                              </div>
                              <Button
                                onClick={() => handleCopyText("Opção 2 da Headline", pitch.headlineArteAlt || pitch.headlineArte)}
                                size="sm"
                                variant="ghost"
                                className="text-[10px] text-[#E5E5E5]/70 hover:text-white hover:bg-[#000000] h-7 px-2 shrink-0 cursor-pointer"
                              >
                                <Copy className="w-3 h-3 mr-1" /> Copiar
                              </Button>
                            </div>
                          </div>

                          {/* Bloco 3: Legenda Completa com CTA Customizado */}
                          <div className="p-3 bg-[#000000]/40 rounded-xl border border-[#E5E5E5]/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-[#FFB020] uppercase tracking-wider flex items-center gap-1">
                                ✍️ Bloco 3: Legenda Completa Pronta para Postar
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-[#E5E5E5]/50 hidden sm:inline">
                                  {includeEmojis ? "Emojis ativos" : "Sem emojis"} • {includeHashtags ? "Hashtags ativas" : "Sem hashtags"}
                                </span>
                                <Button
                                  onClick={() => handleCopyText("Legenda Completa", formattedLegenda)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-[10px] text-[#FFB020] hover:bg-[#000000] h-6 px-2 shrink-0 cursor-pointer"
                                >
                                  <Copy className="w-3 h-3 mr-1" /> Copiar Legenda
                                </Button>
                              </div>
                            </div>
                            <div className="p-3 bg-[#000000]/60 rounded-xl border border-[#E5E5E5]/10 text-xs text-[#E5E5E5] whitespace-pre-line leading-relaxed max-h-52 overflow-y-auto font-sans">
                              {formattedLegenda}
                            </div>
                          </div>

                          {/* Bloco 4: Formato e Justificativa Baseada em Dados */}
                          <div className="text-[11px] text-[#E5E5E5]/80 bg-[#000000]/40 p-3 rounded-xl border border-[#E5E5E5]/10 space-y-1">
                            <span className="text-[10px] font-bold text-[#FFB020] uppercase tracking-wider block">
                              📐 Bloco 4: Formato Recomendado & Estratégia de Conversão
                            </span>
                            <p className="text-xs">
                              <strong className="text-white">{pitch.formato}:</strong> {pitch.justificativaFormato}
                            </p>
                          </div>

                          {/* Painel Expansível de Refazer / Ajustar Pauta (Feature 3) */}
                          {isRefiningThis && (
                            <div className="p-4 bg-[#000000] rounded-xl border border-[#FFB020]/50 space-y-3 animate-in fade-in duration-200">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#FFB020] flex items-center gap-1.5">
                                  <Wand2 className="w-4 h-4" /> Refazer / Ajustar Pauta com IA
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRefiningPitchId(null);
                                    setRefineInstruction("");
                                  }}
                                  className="text-[#E5E5E5]/60 hover:text-white cursor-pointer"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              <Textarea
                                maxLength={500}
                                rows={2}
                                placeholder="Diga o que você quer mudar (ex: 'Deixe mais humorístico', 'Mude para formato Reels de 15s', 'Foque no agendamento de quinta-feira')..."
                                value={refineInstruction}
                                onChange={(e) => setRefineInstruction(e.target.value)}
                                className="bg-[#1E1B4B] border-[#E5E5E5]/20 text-white placeholder:text-[#E5E5E5]/40 text-xs resize-none focus-visible:ring-[#FFB020]"
                              />

                              {/* Chips rápidos de ajuste */}
                              <div className="flex flex-wrap gap-1.5">
                                {[
                                  "🔥 Mais persuasivo para WhatsApp",
                                  "🎬 Transformar em roteiro de Reels",
                                  "😄 Tom descontraído e bem-humorado",
                                  "⚡ Mais curto e direto ao ponto"
                                ].map((chip) => (
                                  <button
                                    key={chip}
                                    type="button"
                                    onClick={() => setRefineInstruction(chip)}
                                    className="text-[10px] bg-[#1E1B4B] border border-[#E5E5E5]/15 text-[#E5E5E5] px-2 py-1 rounded-md hover:border-[#FFB020] hover:text-[#FFB020] transition-colors cursor-pointer"
                                  >
                                    {chip}
                                  </button>
                                ))}
                              </div>

                              <div className="flex items-center justify-end gap-2 pt-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setRefiningPitchId(null);
                                    setRefineInstruction("");
                                  }}
                                  className="text-xs text-[#E5E5E5]/70 hover:text-white h-8"
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  disabled={isRefining}
                                  onClick={() => handleRefineSubmit(pitch)}
                                  className="bg-[#FFB020] hover:bg-[#FFB020]/90 text-black font-extrabold text-xs h-8 px-3 rounded-lg shadow-md cursor-pointer gap-1.5"
                                >
                                  {isRefining ? (
                                    <>
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Ajustando com IA...
                                    </>
                                  ) : (
                                    <>
                                      <Wand2 className="w-3.5 h-3.5" /> Aplicar Ajuste
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Botões de Ação na Base do Card */}
                          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#E5E5E5]/10">
                            <Button
                              onClick={() => {
                                if (isRefiningThis) {
                                  setRefiningPitchId(null);
                                } else {
                                  setRefiningPitchId(pitch.id);
                                  setRefineInstruction("");
                                }
                              }}
                              variant="outline"
                              size="sm"
                              className="border-[#E5E5E5]/20 hover:border-[#FFB020] hover:text-[#FFB020] text-[#E5E5E5] text-xs h-9 px-3 rounded-xl cursor-pointer gap-1.5"
                            >
                              <SlidersHorizontal className="w-3.5 h-3.5" />
                              {isRefiningThis ? "Fechar Ajuste" : "Refazer / Ajustar"}
                            </Button>

                            <Button
                              onClick={() => handleCopyFullPitch(pitch, pitch.headlineArte)}
                              size="sm"
                              className="bg-[#FFB020] hover:bg-[#FFB020]/90 text-black font-bold text-xs h-9 px-4 rounded-xl cursor-pointer gap-1.5 shadow-lg shadow-[#FFB020]/10"
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
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* =========================================================================
              ABA 2: HISTÓRICO DE PAUTAS
             ========================================================================= */}
          <TabsContent value="history" className="space-y-4">
            <Card className="bg-[#1E1B4B] border border-[#E5E5E5]/15 p-5 rounded-2xl shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-[#FFB020]" />
                  Todas as Pautas Criadas ({pitches.length})
                </h3>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-[#E5E5E5]/40 absolute left-3 top-2.5" />
                    <Input
                      placeholder="Buscar por palavra-chave..."
                      value={searchHistory}
                      onChange={(e) => setSearchHistory(e.target.value)}
                      className="bg-[#000000]/60 border-[#E5E5E5]/20 text-xs h-9 pl-8 text-white focus-visible:ring-[#FFB020]"
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
                      className="p-4 bg-[#000000]/60 border border-[#E5E5E5]/10 rounded-xl hover:border-[#FFB020]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-[#1E1B4B] text-[#FFB020] border border-[#FFB020]/30 text-[10px]">
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
                        className="border-[#E5E5E5]/20 bg-[#1E1B4B] text-white hover:text-[#FFB020] text-xs h-8 px-3 rounded-lg cursor-pointer shrink-0"
                      >
                        <Copy className="w-3 h-3 mr-1" /> Copiar
                      </Button>
                    </div>
                  ))}
              </div>
            </Card>
          </TabsContent>

          {/* =========================================================================
              ABA 3: PERFIL DO NEGÓCIO & CONFIGURAÇÃO DE IA (BYOK)
             ========================================================================= */}
          <TabsContent value="profile" className="space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Card 1: Configurações da Marca */}
              <Card className="bg-[#1E1B4B] border border-[#E5E5E5]/15 p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center gap-3 border-b border-[#E5E5E5]/10 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FFB020]/40 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[#FFB020]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Configurações da Marca</h3>
                    <p className="text-xs text-[#E5E5E5]/70">Estes dados orientam o motor de inteligência artificial em todas as pautas.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-white">Nome da Empresa</Label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white text-xs h-10 focus-visible:ring-[#FFB020]"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-white">Nicho de Atuação</Label>
                    <Input
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white text-xs h-10 focus-visible:ring-[#FFB020]"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <Label className="text-xs text-white">Tom de Voz Padrão</Label>
                    <Input
                      value={toneOfVoice}
                      onChange={(e) => setToneOfVoice(e.target.value)}
                      className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white text-xs h-10 focus-visible:ring-[#FFB020]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        localStorage.setItem("gera_pauta_company_name", companyName);
                        localStorage.setItem("gera_pauta_niche", niche);
                        localStorage.setItem("gera_pauta_tone_of_voice", toneOfVoice);
                      }
                      toast.success("✨ Dados da empresa atualizados com sucesso!");
                    }}
                    className="bg-[#FFB020] hover:bg-[#FFB020]/90 text-black font-bold text-xs h-9 px-4 rounded-xl cursor-pointer"
                  >
                    Salvar Alterações da Marca
                  </Button>
                </div>
              </Card>

              {/* Card 2: Potencializador com Chave de IA do Usuário (BYOK) */}
              <Card className="bg-[#1E1B4B] border border-[#E5E5E5]/15 p-6 rounded-2xl shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E5E5]/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FFB020]/40 flex items-center justify-center text-[#FFB020] shadow-lg">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        Chave Própria do Google Gemini (BYOK)
                        {savedMaskedKey ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                            🟢 Conectada & Ativa
                          </Badge>
                        ) : (
                          <Badge className="bg-[#000000] text-[#E5E5E5]/70 border border-[#E5E5E5]/20 text-[10px]">
                            ⚪ Cota Padrão Ativa
                          </Badge>
                        )}
                      </h4>
                      <p className="text-xs text-[#E5E5E5]/70">
                        Conecte sua chave gratuita do Google AI Studio para autonomia adicional e gerações diretas com sua API.
                      </p>
                    </div>
                  </div>

                  {savedMaskedKey && (
                    <Button
                      onClick={handleDisconnectKey}
                      disabled={isDisconnectingKey}
                      variant="outline"
                      size="sm"
                      className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500 text-xs h-8 px-3 rounded-lg cursor-pointer gap-1.5 shrink-0"
                    >
                      {isDisconnectingKey ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      Desconectar ({savedMaskedKey})
                    </Button>
                  )}
                </div>

                {/* Formulário de Inserção da Chave */}
                <div className="space-y-3">
                  <Label className="text-xs text-white">Chave de API do Google Gemini</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <Input
                        type={showApiKey ? "text" : "password"}
                        maxLength={120}
                        placeholder={savedMaskedKey ? `Chave salva: ${savedMaskedKey}` : "Cole sua chave aqui (ex: AIzaSy...)"}
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white text-xs h-10 pl-9 pr-10 focus-visible:ring-[#FFB020]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                        title={showApiKey ? "Ocultar chave" : "Mostrar chave"}
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Botão de Testar Conexão com 1 Clique */}
                    <Button
                      type="button"
                      disabled={isTestingApiKey || !apiKeyInput.trim()}
                      onClick={handleTestApiKey}
                      variant="outline"
                      className="border-[#FFB020]/40 text-[#FFB020] hover:bg-[#FFB020]/10 text-xs h-10 px-4 rounded-xl cursor-pointer shrink-0 font-bold gap-1.5"
                    >
                      {isTestingApiKey ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Testando...
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" /> Testar Conexão
                        </>
                      )}
                    </Button>

                    {/* Botão de Salvar Chave Criptografada */}
                    <Button
                      type="button"
                      disabled={isSavingApiKey || !apiKeyInput.trim()}
                      onClick={handleSaveApiKey}
                      className="bg-[#FFB020] hover:bg-[#FFB020]/90 text-black font-extrabold text-xs h-10 px-4 rounded-xl cursor-pointer shrink-0 gap-1.5 shadow-md shadow-[#FFB020]/20"
                    >
                      {isSavingApiKey ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Criptografando...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" /> Salvar Chave
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Feedback de Teste de Conexão Bem-Sucedido */}
                  {testSuccessInfo && (
                    <div className="flex items-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>
                        Chave validada com sucesso! Resposta do Google AI Studio em <strong>{testSuccessInfo.latencyMs}ms</strong> via modelo <strong>{testSuccessInfo.model}</strong>.
                      </span>
                    </div>
                  )}
                </div>

                {/* Passo a Passo Ilustrado (Em menos de 1 minuto) */}
                <div className="p-4 bg-[#000000]/40 rounded-xl border border-[#E5E5E5]/10 space-y-3">
                  <span className="text-xs font-bold text-[#FFB020] uppercase tracking-wider block">
                    📖 Como obter sua chave gratuita no Google AI Studio em 1 minuto
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-[#1E1B4B]/60 rounded-lg border border-[#E5E5E5]/10 space-y-1">
                      <span className="w-5 h-5 rounded-full bg-[#FFB020] text-black font-bold text-[11px] flex items-center justify-center">
                        1
                      </span>
                      <h5 className="text-xs font-bold text-white">Acesse o Portal</h5>
                      <p className="text-[11px] text-[#E5E5E5]/70 leading-relaxed">
                        Abra o <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-[#FFB020] hover:underline inline-flex items-center gap-1 font-semibold">Google AI Studio <ExternalLink className="w-3 h-3" /></a> e faça login com sua conta Google comum.
                      </p>
                    </div>

                    <div className="p-3 bg-[#1E1B4B]/60 rounded-lg border border-[#E5E5E5]/10 space-y-1">
                      <span className="w-5 h-5 rounded-full bg-[#FFB020] text-black font-bold text-[11px] flex items-center justify-center">
                        2
                      </span>
                      <h5 className="text-xs font-bold text-white">Crie a Chave</h5>
                      <p className="text-[11px] text-[#E5E5E5]/70 leading-relaxed">
                        Clique no botão azul <strong>"Create API key"</strong> no topo da página. O Google gerará a chave instantaneamente sem pedir cartão de crédito.
                      </p>
                    </div>

                    <div className="p-3 bg-[#1E1B4B]/60 rounded-lg border border-[#E5E5E5]/10 space-y-1">
                      <span className="w-5 h-5 rounded-full bg-[#FFB020] text-black font-bold text-[11px] flex items-center justify-center">
                        3
                      </span>
                      <h5 className="text-xs font-bold text-white">Cole e Conecte</h5>
                      <p className="text-[11px] text-[#E5E5E5]/70 leading-relaxed">
                        Copie a chave gerada (começa com <code>AIzaSy...</code>), cole no campo acima, clique em <strong>"Testar Conexão"</strong> e depois em <strong>"Salvar Chave"</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-[11px] text-[#E5E5E5]/60">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Sua chave é salva com criptografia AES-256 e utilizada exclusivamente para processar as suas pautas.</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* =========================================================================
              ABA 4: PLANOS & ASSINATURA
             ========================================================================= */}
          <TabsContent value="billing" className="space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {isPro ? (
                /* ================= VISÃO PARA ASSINANTE PRO ATIVO ================= */
                <div className="space-y-6">
                  {/* Card de Status da Assinatura PRO */}
                  <Card className="bg-gradient-to-br from-[#1E1B4B] to-[#0D0C1D] border-2 border-[#FFB020] p-6 sm:p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB020]/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E5E5]/10 pb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#000000] border-2 border-[#FFB020] flex items-center justify-center text-2xl shadow-lg">
                          👑
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-black text-white">Plano PRO Ativo</h3>
                            <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                              ✓ Assinatura Ativa
                            </Badge>
                          </div>
                          <p className="text-xs text-[#E5E5E5]/70">
                            Você tem acesso completo e ilimitado a todas as ferramentas do Gera Pauta.
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-[#E5E5E5]/60 uppercase block font-semibold">Valor do Plano</span>
                        <span className="text-2xl font-black text-[#FFB020]">R$ 47 <span className="text-xs text-[#E5E5E5]/70 font-normal">/mês</span></span>
                      </div>
                    </div>

                    {/* Vantagens Ativas */}
                    <div className="pt-6 space-y-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Benefícios Liberados no seu Plano:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#E5E5E5]/90">
                        <div className="flex items-center gap-2 bg-[#000000]/40 p-3 rounded-xl border border-[#E5E5E5]/10">
                          <CheckCircle2 className="w-4 h-4 text-[#FFB020] shrink-0" />
                          <span><strong>Pautas Ilimitadas:</strong> Sem travas de degustação de 5 pautas.</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#000000]/40 p-3 rounded-xl border border-[#E5E5E5]/10">
                          <CheckCircle2 className="w-4 h-4 text-[#FFB020] shrink-0" />
                          <span><strong>Refinador com IA:</strong> Ajuste qualquer pauta com instruções naturais.</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#000000]/40 p-3 rounded-xl border border-[#E5E5E5]/10">
                          <CheckCircle2 className="w-4 h-4 text-[#FFB020] shrink-0" />
                          <span><strong>4 Redes Sociais:</strong> Instagram, LinkedIn, WhatsApp e TikTok.</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#000000]/40 p-3 rounded-xl border border-[#E5E5E5]/10">
                          <CheckCircle2 className="w-4 h-4 text-[#FFB020] shrink-0" />
                          <span><strong>2 Headlines de Arte:</strong> Gancho provocativo + autoridade em cada pauta.</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Card de Autoatendimento e Cancelamento Autônomo */}
                  <Card className="bg-[#1E1B4B] border border-[#E5E5E5]/15 p-6 rounded-2xl shadow-xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FFB020]/40 flex items-center justify-center text-[#FFB020]">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">Gerenciar Assinatura & Cancelamento</h4>
                        <p className="text-xs text-[#E5E5E5]/70">
                          Controle autônomo e transparente do seu plano através do portal oficial e seguro da Stripe.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-[#000000]/40 rounded-xl border border-[#E5E5E5]/10 space-y-3">
                      <p className="text-xs text-[#E5E5E5]/80 leading-relaxed">
                        No portal da Stripe você pode a qualquer momento:
                      </p>
                      <ul className="text-xs text-[#E5E5E5]/70 space-y-1 list-disc pl-5">
                        <li><strong>Trocar ou atualizar cartão de crédito</strong> utilizado na assinatura</li>
                        <li><strong>Baixar faturas e comprovantes</strong> de pagamentos anteriores</li>
                        <li><strong>Cancelar sua assinatura com 1 clique</strong> (sem multas, perguntas ou pegadinhas)</li>
                      </ul>

                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <Button
                          onClick={handleOpenCustomerPortal}
                          disabled={isLoadingPortal}
                          className="bg-[#FFB020] hover:bg-[#FFB020]/90 text-black font-extrabold text-xs h-10 px-5 rounded-xl shadow-lg shadow-[#FFB020]/20 cursor-pointer flex items-center gap-2"
                        >
                          {isLoadingPortal ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Conectando ao Portal...
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-3.5 h-3.5" /> Abrir Portal Stripe (Cartões & Faturas)
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => setIsCancelDialogOpen(true)}
                          className="border-rose-500/40 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500 text-xs h-10 px-4 rounded-xl cursor-pointer"
                        >
                          Cancelar Plano Diretamente
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Modal de Confirmação de Cancelamento Direto */}
                  <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                    <DialogContent className="bg-[#1E1B4B] border border-rose-500/40 text-white max-w-md p-6 rounded-2xl shadow-2xl">
                      <DialogHeader className="space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#000000] border border-rose-500/50 flex items-center justify-center mx-auto text-rose-400 shadow-lg">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-lg font-black text-center text-white">
                          Deseja cancelar sua assinatura PRO?
                        </DialogTitle>
                        <DialogDescription className="text-xs text-[#E5E5E5]/80 text-center leading-relaxed">
                          Ao confirmar, sua assinatura do Plano PRO será cancelada na Stripe e sua conta voltará ao plano gratuito de testes.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="flex gap-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsCancelDialogOpen(false)}
                          className="flex-1 border-[#E5E5E5]/20 text-[#E5E5E5] hover:text-white text-xs h-10 rounded-xl"
                        >
                          Voltar / Manter PRO
                        </Button>
                        <Button
                          disabled={isCancellingSub}
                          onClick={handleCancelSubscription}
                          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-10 rounded-xl shadow-lg cursor-pointer"
                        >
                          {isCancellingSub ? (
                            <span className="flex items-center gap-1.5 justify-center">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Cancelando...
                            </span>
                          ) : (
                            "Sim, Cancelar Plano"
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                /* ================= VISÃO PARA USUÁRIO GRÁTIS / DEGUSTAÇÃO ================= */
                <>
                  {/* Card de Controle de Quota */}
                  <Card className="bg-[#1E1B4B] border border-[#E5E5E5]/15 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#FFB020]" />
                        Status da sua Degustação Gratuita
                      </h3>
                      <p className="text-xs text-[#E5E5E5]/70">
                        Você utilizou <strong>{usedPitches}</strong> de <strong>{maxFreePitches}</strong> pautas gratuitas.
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleResetQuota}
                        className="text-[11px] text-[#FFB020] hover:underline p-0 h-auto cursor-pointer"
                      >
                        🔄 Restaurar saldo de 5 pautas para continuar testando
                      </Button>
                    </div>
                    <div className="w-full sm:w-48 bg-[#000000] h-2.5 rounded-full overflow-hidden border border-[#E5E5E5]/20">
                      <div
                        className="h-full bg-[#FFB020]"
                        style={{ width: `${(usedPitches / maxFreePitches) * 100}%` }}
                      />
                    </div>
                  </Card>

                  {/* Tabela de Planos Comerciais */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Plano Gratuito */}
                    <Card className="bg-[#1E1B4B]/60 border border-[#E5E5E5]/15 p-6 rounded-2xl space-y-4">
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
                    <Card className="bg-[#1E1B4B] border-2 border-[#FFB020] p-6 rounded-2xl space-y-4 relative shadow-2xl">
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-[#FFB020] text-black font-extrabold text-[10px]">RECOMENDADO</Badge>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-[#FFB020] font-semibold uppercase">Ilimitado & Comercial</span>
                        <h4 className="text-xl font-black text-white">Plano Pro</h4>
                        <span className="text-2xl font-black text-white">R$ 47 <span className="text-xs font-normal text-[#E5E5E5]/60">/mês</span></span>
                      </div>
                      <ul className="text-xs text-[#E5E5E5]/80 space-y-2">
                        <li>✓ Pautas ilimitadas com IA inclusa</li>
                        <li>✓ Múltiplos clientes e nichos</li>
                        <li>✓ Refazer e ajustar pautas com IA</li>
                        <li>✓ Suporte prioritário via WhatsApp</li>
                      </ul>
                      <Button
                        disabled={isStartingCheckout}
                        onClick={handleStartCheckout}
                        className="w-full bg-[#FFB020] hover:bg-[#FFB020]/90 text-black font-black text-xs h-10 rounded-xl shadow-lg shadow-[#FFB020]/20 cursor-pointer"
                      >
                        {isStartingCheckout ? (
                          <span className="flex items-center gap-1.5">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Conectando ao Checkout...
                          </span>
                        ) : (
                          "Assinar Plano Pro Agora"
                        )}
                      </Button>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* =========================================================================
            MODAL DE UPGRADE / QUOTA ESGOTADA (FEATURE 4 - CRITÉRIO DO PRD)
           ========================================================================= */}
        <Dialog open={isQuotaModalOpen} onOpenChange={setIsQuotaModalOpen}>
          <DialogContent className="bg-[#1E1B4B] border border-[#FFB020]/50 text-white max-w-lg p-6 rounded-2xl shadow-2xl">
            <DialogHeader className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#000000] border border-[#FFB020] flex items-center justify-center mx-auto text-[#FFB020] shadow-lg">
                <Zap className="w-6 h-6" />
              </div>
              <DialogTitle className="text-xl font-black text-center text-white">
                Degustação de 5 Pautas Concluída! 🎉
              </DialogTitle>
              <DialogDescription className="text-xs text-[#E5E5E5]/80 text-center leading-relaxed">
                Você atingiu o limite gratuito de 5 pautas estruturadas. Escolha abaixo como deseja continuar criando conteúdo sem limites:
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-3">
              {/* Opção 1: Plano PRO */}
              <div className="p-4 bg-[#000000]/60 rounded-xl border-2 border-[#FFB020] space-y-2 relative shadow-lg">
                <Badge className="bg-[#FFB020] text-black font-extrabold text-[9px] absolute -top-2.5 right-4">
                  RECOMENDADO
                </Badge>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Plano PRO Ilimitado</h4>
                  <span className="text-base font-black text-[#FFB020]">
                    R$ 47 <span className="text-[11px] font-normal text-[#E5E5E5]/60">/mês</span>
                  </span>
                </div>
                <p className="text-[11px] text-[#E5E5E5]/70">
                  Pautas ilimitadas com inteligência artificial inclusa, todos os 4 canais e suporte direto.
                </p>
                <Button
                  disabled={isStartingCheckout || isPro}
                  onClick={() => {
                    setIsQuotaModalOpen(false);
                    handleStartCheckout();
                  }}
                  className="w-full bg-[#FFB020] hover:bg-[#FFB020]/90 text-black font-extrabold text-xs h-9 rounded-lg cursor-pointer"
                >
                  {isStartingCheckout ? "Conectando ao Checkout..." : isPro ? "Plano PRO Ativo 👑" : "Assinar Plano Pro"}
                </Button>
              </div>

              {/* Opção 2: BYOK Gratuito */}
              <div className="p-4 bg-[#000000]/40 rounded-xl border border-[#E5E5E5]/15 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#FFB020]" /> Chave de IA Própria (BYOK)
                  </h4>
                  <span className="text-xs font-bold text-[#E5E5E5]">Grátis</span>
                </div>
                <p className="text-[11px] text-[#E5E5E5]/70">
                  Conecte sua chave gratuita do Google AI Studio para autonomia sem custo adicional.
                </p>
                <Button
                  onClick={() => {
                    setIsQuotaModalOpen(false);
                    setActiveTab("profile");
                  }}
                  variant="outline"
                  className="w-full border-[#E5E5E5]/20 text-[#E5E5E5] hover:text-white hover:border-[#FFB020] text-xs h-9 rounded-lg cursor-pointer"
                >
                  Conectar Chave Gratuita
                </Button>
              </div>

              {/* Atalho para Desenvolvedor continuar testando */}
              <div className="pt-2 text-center border-t border-[#E5E5E5]/10">
                <button
                  type="button"
                  onClick={handleResetQuota}
                  className="text-[11px] text-[#E5E5E5]/60 hover:text-[#FFB020] underline cursor-pointer"
                >
                  ⚙️ Restaurar 5 pautas para continuar testando (Modo Desenvolvedor)
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
