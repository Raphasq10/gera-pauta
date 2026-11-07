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
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Plus,
  Pencil,
  ShieldAlert,
  Target,
  Heart
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

  // Contexto do Negócio (Memória de Marca Turbinada)
  const [companyName, setCompanyName] = useState("Clínica Sorriso & Bem-Estar");
  const [niche, setNiche] = useState("Odontologia Estética");
  const [toneOfVoice, setToneOfVoice] = useState("Profissional, acolhedor e empático");
  const [keyPain, setKeyPain] = useState("Medo de procedimentos dolorosos e tratamentos artificiais");
  const [differential, setDifferential] = useState("Tecnologia a laser sem dor e atendimento humanizado pontual");
  const [mainProduct, setMainProduct] = useState("Clareamento a Laser sem sensibilidade e Lentes em Resina");
  const [forbiddenWords, setForbiddenWords] = useState("Não falar que é o mais barato da cidade, não prometer cura milagrosa, evitar jargões médicos em latim");

  // Gestão de Personas / Públicos-Alvo
  const [personas, setPersonas] = useState<PersonaData[]>(INITIAL_PERSONAS);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(INITIAL_PERSONAS[0].id);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState<boolean>(false);
  const [editingPersonaId, setEditingPersonaId] = useState<string | null>(null);
  const [personaForm, setPersonaForm] = useState({
    name: "",
    role: "",
    category: "estetica",
    keyPain: "",
    desire: "",
    objection: "",
    tone: "Profissional, acolhedor e empático"
  });

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
  const [hasCanceledSub, setHasCanceledSub] = useState<boolean>(false);
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

  // Paginação da Galeria de Ideias Anteriores (A partir do 2º card)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const cardsPerPage = 6;

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
    // Validação de assinatura: assinante PRO ou chave própria necessária
    if (!isPro && !hasByok && !userApiKey.trim()) {
      toast.error("O ajuste e refinamento com IA é um recurso do Plano PRO. Suas pautas continuam salvas para cópia!");
      setActiveTab("billing");
      return;
    }

    const cleanInstruction = refineInstruction.trim();
    if (!cleanInstruction || cleanInstruction.length < 3) {
      toast.error("Por favor, digite pelo menos 3 caracteres indicando o que deseja ajustar.");
      return;
    }

    setIsRefining(true);
    const activePersona = personas.find((p) => p.id === selectedPersonaId) || personas[0];
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
            differential,
            mainProduct,
            forbiddenWords,
            personaDetails: {
              name: activePersona.name,
              role: activePersona.role,
              keyPain: activePersona.keyPain,
              desire: activePersona.desire,
              objection: activePersona.objection
            }
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
                setIsPro(quotaData.quota.isPro === true);
                if (quotaData.quota.isCanceled) {
                  setHasCanceledSub(true);
                }
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
            if (business.main_product) setMainProduct(business.main_product);
            if (business.forbidden_words) setForbiddenWords(business.forbidden_words);
            if (Array.isArray(business.custom_personas) && business.custom_personas.length > 0) {
              setPersonas(business.custom_personas);
            }
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
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "billing") {
        setActiveTab("billing");
      }
      if (params.get("portal_return") === "true") {
        setActiveTab("billing");
        toast.info("Retornando do gerenciamento da Stripe...");
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const savedContext = localStorage.getItem("gera_pauta_business_context");
      if (savedContext) {
        try {
          const parsed = JSON.parse(savedContext);
          if (parsed.companyName) setCompanyName(parsed.companyName);
          if (parsed.niche) setNiche(parsed.niche);
          if (parsed.toneOfVoice) setToneOfVoice(parsed.toneOfVoice);
          if (parsed.differential) setDifferential(parsed.differential);
          if (parsed.mainProduct) setMainProduct(parsed.mainProduct);
          if (parsed.forbiddenWords) setForbiddenWords(parsed.forbiddenWords);
        } catch {}
      }

      const savedMainProduct = localStorage.getItem("gera_pauta_main_product");
      if (savedMainProduct) setMainProduct(savedMainProduct);

      const savedForbidden = localStorage.getItem("gera_pauta_forbidden_words");
      if (savedForbidden) setForbiddenWords(savedForbidden);

      const savedDifferential = localStorage.getItem("gera_pauta_differential");
      if (savedDifferential) setDifferential(savedDifferential);

      const savedPersonas = localStorage.getItem("gera_pauta_personas_v2");
      if (savedPersonas) {
        try {
          const parsedPersonas = JSON.parse(savedPersonas);
          if (Array.isArray(parsedPersonas) && parsedPersonas.length > 0) {
            setPersonas(parsedPersonas);
          }
        } catch {}
      }

      const savedKey = localStorage.getItem("gera_pauta_byok_key");
      if (savedKey) setUserApiKey(savedKey);

      // Sincroniza dados automaticamente sempre que o usuário retornar à aba
      const handleFocus = () => {
        loadSupabaseData();
      };
      window.addEventListener("focus", handleFocus);
      return () => {
        window.removeEventListener("focus", handleFocus);
      };
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
        setHasCanceledSub(true);
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

  // Gestão de Memória de Marca (Perfil da Empresa Turbinado)
  const handleSaveBrandContext = async () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gera_pauta_company_name", companyName);
      localStorage.setItem("gera_pauta_niche", niche);
      localStorage.setItem("gera_pauta_tone_of_voice", toneOfVoice);
      localStorage.setItem("gera_pauta_differential", differential);
      localStorage.setItem("gera_pauta_main_product", mainProduct);
      localStorage.setItem("gera_pauta_forbidden_words", forbiddenWords);
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("businesses").insert({
          user_id: user.id,
          company_name: companyName,
          niche,
          tone_of_voice: toneOfVoice,
          differential,
          key_pain: keyPain,
          main_product: mainProduct,
          forbidden_words: forbiddenWords,
          custom_personas: personas,
        });
      }
    } catch (err) {
      console.warn("Erro ao salvar no Supabase:", err);
    }

    toast.success("✨ Memória de marca e diretrizes salvas com sucesso!");
  };

  const syncPersonasToSupabase = async (updatedPersonas: PersonaData[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("businesses").insert({
          user_id: user.id,
          company_name: companyName,
          niche,
          tone_of_voice: toneOfVoice,
          differential,
          key_pain: keyPain,
          main_product: mainProduct,
          forbidden_words: forbiddenWords,
          custom_personas: updatedPersonas,
        });
      }
    } catch (e) {
      console.warn("Erro ao sincronizar personas na nuvem:", e);
    }
  };

  // Gestão de Personas (CRUD)
  const handleOpenNewPersona = () => {
    setEditingPersonaId(null);
    setPersonaForm({
      name: "",
      role: "",
      category: niche ? niche.toLowerCase() : "geral",
      keyPain: "",
      desire: "",
      objection: "",
      tone: toneOfVoice || "Profissional, acolhedor e empático"
    });
    setIsPersonaModalOpen(true);
  };

  const handleOpenEditPersona = (p: PersonaData) => {
    setEditingPersonaId(p.id);
    setPersonaForm({
      name: p.name,
      role: p.role,
      category: p.category || "geral",
      keyPain: p.keyPain,
      desire: p.desire || "",
      objection: p.objection || "",
      tone: p.tone || toneOfVoice
    });
    setIsPersonaModalOpen(true);
  };

  const handleSavePersona = () => {
    if (!personaForm.name.trim() || !personaForm.keyPain.trim()) {
      toast.error("Por favor, preencha ao menos o nome da persona e a dor principal!");
      return;
    }

    if (editingPersonaId) {
      const updated = personas.map((p) =>
        p.id === editingPersonaId
          ? {
              ...p,
              name: personaForm.name.trim(),
              role: personaForm.role.trim() || "Cliente Ideal",
              category: personaForm.category.trim() || "geral",
              keyPain: personaForm.keyPain.trim(),
              desire: personaForm.desire.trim(),
              objection: personaForm.objection.trim(),
              tone: personaForm.tone.trim() || toneOfVoice
            }
          : p
      );
      setPersonas(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("gera_pauta_personas_v2", JSON.stringify(updated));
      }
      syncPersonasToSupabase(updated);
      toast.success(`✨ Persona "${personaForm.name}" atualizada com sucesso!`);
    } else {
      const newPersona: PersonaData = {
        id: `persona-${Date.now()}`,
        name: personaForm.name.trim(),
        role: personaForm.role.trim() || "Cliente Ideal",
        category: personaForm.category.trim() || "geral",
        keyPain: personaForm.keyPain.trim(),
        desire: personaForm.desire.trim(),
        objection: personaForm.objection.trim(),
        tone: personaForm.tone.trim() || toneOfVoice,
        topInterests: [],
        topGoals: [],
        suggestedFormats: ["Carrossel Educativo", "Reels Curto", "Post de Autoridade"],
        isCustom: true
      };
      const updated = [newPersona, ...personas];
      setPersonas(updated);
      setSelectedPersonaId(newPersona.id);
      if (typeof window !== "undefined") {
        localStorage.setItem("gera_pauta_personas_v2", JSON.stringify(updated));
      }
      syncPersonasToSupabase(updated);
      toast.success(`✨ Nova persona "${newPersona.name}" cadastrada com sucesso!`);
    }
    setIsPersonaModalOpen(false);
  };

  const handleDeletePersona = (personaId: string, personaName: string) => {
    if (personas.length <= 1) {
      toast.error("Você precisa manter ao menos uma persona cadastrada!");
      return;
    }
    const filtered = personas.filter((p) => p.id !== personaId);
    setPersonas(filtered);
    if (selectedPersonaId === personaId) {
      setSelectedPersonaId(filtered[0].id);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("gera_pauta_personas_v2", JSON.stringify(filtered));
    }
    syncPersonasToSupabase(filtered);
    toast.success(`Persona "${personaName}" removida.`);
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
            differential,
            mainProduct,
            forbiddenWords,
            personaDetails: {
              name: personaSelected.name,
              role: personaSelected.role,
              keyPain: personaSelected.keyPain,
              desire: personaSelected.desire,
              objection: personaSelected.objection
            }
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
        const currentDateFormatted = new Date().toLocaleDateString("pt-BR");
        const enrichedPitches: PitchContent[] = data.pitches.map((p: any) => ({
          ...p,
          createdAt: p.createdAt || currentDateFormatted,
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

        toast.success(`✨ ${enrichedPitches.length} pautas contextualizadas criadas com sucesso!`);
        
        // Rola suavemente para a pauta gerada em destaque
        if (typeof window !== "undefined") {
          setTimeout(() => {
            const cardElem = document.getElementById("featured-card");
            if (cardElem) {
              cardElem.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 100);
        }
      } else {
        const errorMsg = data.details?.[0]?.message || data.error || "Erro na geração de pautas.";
        toast.error(errorMsg);
        console.error("[GENERATE_API_ERROR]:", data);
      }
    } catch (err: any) {
      console.error("[GENERATE_NETWORK_ERROR]:", err);
      toast.error(err.message || "Erro de conexão ao gerar pautas.");
    } finally {
      setIsGenerating(false);
    }
  };

  const latestPitch = pitches.length > 0 ? pitches[0] : null;
  const olderPitches = pitches.length > 1 ? pitches.slice(1) : [];
  const totalPages = Math.max(1, Math.ceil(olderPitches.length / cardsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * cardsPerPage;
  const currentOlderPitches = olderPitches.slice(startIndex, startIndex + cardsPerPage);

  // Renderizador unificado e modular para Cards de Pauta (Destaque e Grade Dupla)
  const renderPitchCard = (pitch: PitchContent, displayIndex: number, isFeatured: boolean) => {
    const formattedLegenda = getFormattedLegenda(pitch.legenda, includeEmojis, includeHashtags);
    const isRefiningThis = refiningPitchId === pitch.id;

    return (
      <Card
        id={isFeatured ? "featured-card" : undefined}
        key={pitch.id}
        className={`bg-[#1E1B4B] border transition-all space-y-4 relative overflow-hidden p-5 rounded-2xl shadow-xl flex flex-col justify-between ${
          isFeatured
            ? "border-[#FFB020]/70 shadow-2xl hover:border-[#FFB020]"
            : "border-[#E5E5E5]/15 hover:border-[#FFB020]/50"
        }`}
      >
        <div className="space-y-4">
          {/* Indicador de Cabeçalho do Card */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E5E5]/10 pb-3">
            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                  isFeatured
                    ? "bg-[#FFB020] text-black border-[#FFB020]"
                    : "bg-[#000000] border-[#FFB020]/50 text-[#FFB020]"
                }`}
              >
                {displayIndex}
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {pitch.formato || "Pauta Recomendada"}
              </span>
              {isFeatured && (
                <Badge className="bg-[#FFB020] text-black font-extrabold text-[9px] uppercase tracking-wider">
                  ⭐ Em Destaque
                </Badge>
              )}
              {pitch.version && pitch.version > 1 && (
                <Badge className="bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/40 text-[10px] flex items-center gap-1 font-bold">
                  <Wand2 className="w-3 h-3" /> v{pitch.version} (Ajustada)
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge className="bg-[#000000] text-[#E5E5E5] border border-[#E5E5E5]/20 text-[10px] font-bold">
                {pitch.channel?.toUpperCase() || channel.toUpperCase()}
              </Badge>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-[#000000]/60 px-2 py-0.5 rounded-md border border-[#E5E5E5]/15">
                <Calendar className="w-3 h-3 text-[#FFB020]" />
                {pitch.createdAt || new Date().toLocaleDateString("pt-BR")}
              </span>
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
              🖼️ Bloco 2: Duas Opções de Headline da Arte:
            </span>

            {/* Opção 1 */}
            <div className="flex items-center justify-between gap-2 p-2.5 bg-[#1E1B4B]/70 rounded-lg border border-[#E5E5E5]/15">
              <div className="flex-1 pr-2">
                <span className="text-[10px] text-[#FFB020] font-bold block mb-0.5">
                  Opção 1 (Pergunta Provocativa):
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

            {/* Opção 2 */}
            <div className="flex items-center justify-between gap-2 p-2.5 bg-[#1E1B4B]/40 rounded-lg border border-[#E5E5E5]/10">
              <div className="flex-1 pr-2">
                <span className="text-[10px] text-[#E5E5E5]/70 font-semibold block mb-0.5">
                  Opção 2 (Afirmação de Impacto):
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

          {/* Bloco 3: Legenda Completa */}
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
            <div
              className={`p-3 bg-[#000000]/60 rounded-xl border border-[#E5E5E5]/10 text-xs text-[#E5E5E5] whitespace-pre-line leading-relaxed overflow-y-auto font-sans ${
                isFeatured ? "max-h-52" : "max-h-40"
              }`}
            >
              {formattedLegenda}
            </div>
          </div>

          {/* Bloco 4: Formato Recomendado */}
          <div className="text-[11px] text-[#E5E5E5]/80 bg-[#000000]/40 p-3 rounded-xl border border-[#E5E5E5]/10 space-y-1">
            <span className="text-[10px] font-bold text-[#FFB020] uppercase tracking-wider block">
              📐 Bloco 4: Formato Recomendado & Estratégia de Conversão
            </span>
            <p className="text-xs">
              <strong className="text-white">{pitch.formato}:</strong> {pitch.justificativaFormato}
            </p>
          </div>

          {/* Painel Expansível de Refazer / Ajustar */}
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
                placeholder="Diga o que você quer mudar (ex: 'Deixe mais persuasivo para agendamento', 'Transforme em formato carrossel mito vs verdade')..."
                value={refineInstruction}
                onChange={(e) => setRefineInstruction(e.target.value)}
                className="bg-[#1E1B4B] border-[#E5E5E5]/20 text-white placeholder:text-[#E5E5E5]/40 text-xs resize-none focus-visible:ring-[#FFB020]"
              />

              {/* Chips rápidos */}
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
                  className="text-xs text-[#E5E5E5]/70 hover:text-white h-8 cursor-pointer"
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
        </div>

        {/* Botões de Ação na Base do Card */}
        <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#E5E5E5]/10 mt-2">
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
  };

  const currentPersona = personas.find((p) => p.id === selectedPersonaId) || personas[0];

  return (
    <div className="min-h-screen bg-[#0D0C1D] text-white flex flex-col font-sans selection:bg-[#FFB020]/30">
      {/* TOPBAR PRINCIPAL */}
      <header className="border-b border-[#2A2A3A] bg-[#1E1B4B] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Logo Oficial e Nome da Marca (Volta para o Gerador no clique) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("generator")}
              className="flex items-center gap-3 group cursor-pointer text-left focus:outline-none"
              title="Ir para o 1. Gerador de Pautas"
            >
              <img 
                src="/images/logo.png" 
                alt="Gera Pauta" 
                className="h-8 w-auto object-contain group-hover:scale-105 transition-transform" 
              />
              <div className="hidden sm:block border-l border-[#2A2A3A] pl-3">
                <span className="text-[11px] text-slate-300 group-hover:text-[#FFB020] truncate max-w-[200px] block font-medium transition-colors">
                  {companyName} • {niche}
                </span>
              </div>
            </button>
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
                    <div className="flex items-center justify-between">
                      <Label className="text-white text-xs flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#FFB020]" />
                        <span>Persona / Cliente-Alvo</span>
                      </Label>
                      <button
                        type="button"
                        onClick={() => setActiveTab("profile")}
                        className="text-[10px] text-[#FFB020] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Pencil className="w-2.5 h-2.5" /> Gerenciar Personas ({personas.length})
                      </button>
                    </div>
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

                  {/* Detalhe da Dor, Objeção e Desejo da Persona Selecionada */}
                  <div className="p-3 bg-[#000000]/60 rounded-xl border border-[#E5E5E5]/10 text-xs space-y-2">
                    <div>
                      <span className="text-[#FFB020] font-bold text-[10px] uppercase flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-[#FFB020]" /> Dor que a IA vai quebrar:
                      </span>
                      <p className="text-[#E5E5E5]/90 text-[11px] leading-relaxed mt-0.5">
                        "{currentPersona.keyPain}"
                      </p>
                    </div>
                    {currentPersona.objection && (
                      <div className="pt-1.5 border-t border-[#E5E5E5]/10">
                        <span className="text-amber-400 font-bold text-[10px] uppercase flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-amber-400" /> Objeção Oculta da Persona:
                        </span>
                        <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                          "{currentPersona.objection}"
                        </p>
                      </div>
                    )}
                    {currentPersona.desire && (
                      <div className="pt-1.5 border-t border-[#E5E5E5]/10">
                        <span className="text-emerald-400 font-bold text-[10px] uppercase flex items-center gap-1">
                          <Heart className="w-3 h-3 text-emerald-400" /> Desejo / Transformação Buscada:
                        </span>
                        <p className="text-emerald-200/90 text-[11px] leading-relaxed mt-0.5">
                          "{currentPersona.desire}"
                        </p>
                      </div>
                    )}
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

              {/* COLUNA DIREITA: RESULTADOS / CARD EM DESTAQUE (ÚLTIMA IDEIA GERADA) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FFB020]" />
                    Última Pauta Gerada (Em Destaque)
                  </h3>
                  <span className="text-[11px] text-[#E5E5E5]/60">
                    Clique em copiar para enviar direto ao designer ou WhatsApp
                  </span>
                </div>

                {/* Loading State com Skeletons e Feedback Visual Ativo */}
                {isGenerating && (
                  <div className="space-y-4">
                    <Card className="bg-[#1E1B4B] border border-[#FFB020]/50 p-6 rounded-2xl space-y-4 shadow-xl">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]/10">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-[#FFB020] animate-spin" />
                          <span className="text-xs font-bold text-[#FFB020]">Criando pautas estruturadas com IA...</span>
                        </div>
                        <Badge className="bg-[#FFB020]/20 text-[#FFB020] text-[10px] border border-[#FFB020]/30 animate-pulse">
                          Gerando
                        </Badge>
                      </div>
                      <div className="space-y-3 pt-1">
                        <Skeleton className="h-4 w-1/3 bg-[#000000]/60 rounded-md" />
                        <Skeleton className="h-6 w-3/4 bg-[#000000]/60 rounded-md" />
                        <Skeleton className="h-16 w-full bg-[#000000]/60 rounded-xl" />
                        <Skeleton className="h-8 w-1/2 bg-[#000000]/60 rounded-md" />
                      </div>
                    </Card>
                  </div>
                )}

                {/* Estado Sem Pauta ou Exibição do Card Mais Recente */}
                {!isGenerating && !latestPitch ? (
                  <Card className="bg-[#1E1B4B] border border-[#E5E5E5]/15 p-12 text-center rounded-2xl">
                    <Sparkles className="w-8 h-8 text-[#FFB020] mx-auto mb-2 opacity-50" />
                    <h4 className="text-sm font-bold text-white">Nenhuma pauta gerada ainda</h4>
                    <p className="text-xs text-[#E5E5E5]/70 mt-1">
                      Escolha uma persona ao lado e clique em "Gerar Pautas Estruturadas".
                    </p>
                  </Card>
                ) : !isGenerating && latestPitch ? (
                  renderPitchCard(latestPitch, 1, true)
                ) : null}
              </div>
            </div>

            {/* =========================================================================
                SEÇÃO INFERIOR: GALERIA DE IDEIAS ANTERIORES (GRADE DUPLA COM PAGINAÇÃO)
               ========================================================================= */}
            {olderPitches.length > 0 && (
              <section id="gallery-section" className="pt-6 space-y-5 border-t border-[#2A2A3A]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#1E1B4B]/70 p-4 rounded-2xl border border-[#E5E5E5]/10">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <History className="w-4 h-4 text-[#FFB020]" />
                      Ideias Anteriores Geradas ({olderPitches.length})
                    </h3>
                    <p className="text-xs text-[#E5E5E5]/70">
                      Pautas criadas anteriormente organizadas em grade de 2 colunas com paginação de até 6 cards.
                    </p>
                  </div>

                  {/* Contador de Página */}
                  <div className="text-xs text-[#E5E5E5]/80 bg-[#000000]/60 px-3.5 py-1.5 rounded-full border border-[#E5E5E5]/15 font-mono">
                    Página <strong className="text-[#FFB020]">{validCurrentPage}</strong> de <strong className="text-white">{totalPages}</strong>
                  </div>
                </div>

                {/* Grade em 2 Colunas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {currentOlderPitches.map((pitch, idx) =>
                    renderPitchCard(pitch, startIndex + idx + 2, false)
                  )}
                </div>

                {/* Controles de Paginação (6 cards por página) */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 p-4 bg-[#1E1B4B]/40 rounded-2xl border border-[#E5E5E5]/10">
                    <span className="text-xs text-[#E5E5E5]/60 font-medium">
                      Exibindo <strong>{startIndex + 1}</strong> a <strong>{Math.min(startIndex + cardsPerPage, olderPitches.length)}</strong> de <strong>{olderPitches.length}</strong> ideias anteriores
                    </span>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={validCurrentPage === 1}
                        onClick={() => {
                          setCurrentPage(prev => Math.max(1, prev - 1));
                          document.getElementById("gallery-section")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="border-[#E5E5E5]/20 bg-[#000000]/60 text-white hover:border-[#FFB020] hover:text-[#FFB020] text-xs h-8 px-3 rounded-lg cursor-pointer disabled:opacity-30"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Anterior
                      </Button>

                      {/* Botões Numerados de Página */}
                      {Array.from({ length: totalPages }).map((_, pIdx) => {
                        const pageNum = pIdx + 1;
                        const isActive = pageNum === validCurrentPage;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => {
                              setCurrentPage(pageNum);
                              document.getElementById("gallery-section")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isActive
                                ? "bg-[#FFB020] text-black shadow-md shadow-[#FFB020]/20 scale-105"
                                : "bg-[#000000]/60 border border-[#E5E5E5]/15 text-[#E5E5E5] hover:border-[#FFB020] hover:text-[#FFB020]"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={validCurrentPage === totalPages}
                        onClick={() => {
                          setCurrentPage(prev => Math.min(totalPages, prev + 1));
                          document.getElementById("gallery-section")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="border-[#E5E5E5]/20 bg-[#000000]/60 text-white hover:border-[#FFB020] hover:text-[#FFB020] text-xs h-8 px-3 rounded-lg cursor-pointer disabled:opacity-30"
                      >
                        Próxima <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </section>
            )}
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
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="bg-[#1E1B4B] text-[#FFB020] border border-[#FFB020]/30 text-[10px] font-bold">
                            {p.channel?.toUpperCase() || "POST"}
                          </Badge>
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-300 bg-[#000000]/80 px-2 py-0.5 rounded border border-[#E5E5E5]/15 font-medium">
                            <Calendar className="w-3 h-3 text-[#FFB020]" />
                            {p.createdAt || new Date().toLocaleDateString("pt-BR")}
                          </span>
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
              {/* Card 1: Configurações da Marca Turbinada */}
              <Card className="bg-[#1E1B4B] border border-[#E5E5E5]/15 p-6 rounded-2xl shadow-xl space-y-5">
                <div className="flex items-center gap-3 border-b border-[#E5E5E5]/10 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FFB020]/40 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[#FFB020]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      Memória de Marca & Contexto Estratégico
                      <Badge className="bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/30 text-[10px]">
                        Contexto Ativo
                      </Badge>
                    </h3>
                    <p className="text-xs text-[#E5E5E5]/70">
                      Estes dados alimentam diretamente o motor de inteligência artificial em todas as pautas geradas.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-white">Nome da Empresa</Label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ex: Clínica Sorriso & Bem-Estar"
                      className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white text-xs h-10 focus-visible:ring-[#FFB020]"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-white">Nicho de Atuação</Label>
                    <Input
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      placeholder="Ex: Odontologia Estética / Saúde"
                      className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white text-xs h-10 focus-visible:ring-[#FFB020]"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <Label className="text-xs text-white flex items-center justify-between">
                      <span>Diferencial Competitivo Único (Proposta de Valor)</span>
                      <span className="text-[10px] text-[#FFB020]">O que só a sua marca tem?</span>
                    </Label>
                    <Input
                      value={differential}
                      onChange={(e) => setDifferential(e.target.value)}
                      placeholder="Ex: Tecnologia a laser sem dor e atendimento humanizado pontual"
                      className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white text-xs h-10 focus-visible:ring-[#FFB020]"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-white">Serviço ou Oferta Carro-Chefe</Label>
                    <Input
                      value={mainProduct}
                      onChange={(e) => setMainProduct(e.target.value)}
                      placeholder="Ex: Clareamento a Laser + Protocolo de Lentes"
                      className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white text-xs h-10 focus-visible:ring-[#FFB020]"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-white">Tom de Voz Padrão</Label>
                    <Input
                      value={toneOfVoice}
                      onChange={(e) => setToneOfVoice(e.target.value)}
                      placeholder="Ex: Profissional, acolhedor, elegante e empático"
                      className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white text-xs h-10 focus-visible:ring-[#FFB020]"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <Label className="text-xs text-rose-300 flex items-center gap-1.5 font-bold">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      <span>Diretrizes Negativas: O que a IA NUNCA deve falar (Termos e Clichês Proibidos)</span>
                    </Label>
                    <Textarea
                      value={forbiddenWords}
                      onChange={(e) => setForbiddenWords(e.target.value)}
                      rows={2}
                      placeholder="Ex: Não falar que é o mais barato da cidade, não prometer cura milagrosa, evitar jargões médicos em latim..."
                      className="bg-[#000000]/60 border-rose-500/30 text-white text-xs focus-visible:ring-rose-500 rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    onClick={handleSaveBrandContext}
                    className="bg-[#FFB020] hover:bg-[#FFB020]/90 text-black font-bold text-xs h-9 px-5 rounded-xl cursor-pointer shadow-lg shadow-[#FFB020]/20"
                  >
                    Salvar Alterações da Marca
                  </Button>
                </div>
              </Card>

              {/* Card 2: Gestão Completa de Personas & Públicos-Alvo */}
              <Card className="bg-[#1E1B4B] border border-[#E5E5E5]/15 p-6 rounded-2xl shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E5E5]/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FFB020]/40 flex items-center justify-center text-[#FFB020]">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        Personas & Públicos-Alvo ({personas.length})
                      </h3>
                      <p className="text-xs text-[#E5E5E5]/70">
                        A IA usa as dores, desejos e objeções de cada persona para produzir copies com alta conversão.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleOpenNewPersona}
                    className="bg-[#FFB020] hover:bg-[#FFB020]/90 text-black font-bold text-xs h-9 px-4 rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Nova Persona
                  </Button>
                </div>

                {/* Grade de Personas Cadastradas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personas.map((p) => {
                    const isSelected = selectedPersonaId === p.id;
                    return (
                      <div
                        key={p.id}
                        className={`p-4 rounded-xl border transition-all space-y-3 bg-[#000000]/50 ${
                          isSelected
                            ? "border-[#FFB020] shadow-md shadow-[#FFB020]/10"
                            : "border-[#E5E5E5]/10 hover:border-[#FFB020]/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-white">{p.name}</h4>
                              <Badge className="bg-[#1E1B4B] text-[#FFB020] border border-[#FFB020]/30 text-[9px] uppercase font-bold">
                                {p.category || "Geral"}
                              </Badge>
                              {isSelected && (
                                <Badge className="bg-[#FFB020] text-black text-[9px] font-extrabold uppercase">
                                  Ativa no Gerador
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-[#E5E5E5]/70 mt-0.5">{p.role}</p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              onClick={() => handleOpenEditPersona(p)}
                              variant="ghost"
                              size="sm"
                              className="text-[#E5E5E5]/70 hover:text-[#FFB020] hover:bg-[#000000] h-7 w-7 p-0 rounded-lg cursor-pointer"
                              title="Editar persona"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              onClick={() => handleDeletePersona(p.id, p.name)}
                              variant="ghost"
                              size="sm"
                              className="text-[#E5E5E5]/70 hover:text-rose-400 hover:bg-[#000000] h-7 w-7 p-0 rounded-lg cursor-pointer"
                              title="Excluir persona"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* Detalhes Estratégicos de Copywriting da Persona */}
                        <div className="space-y-1.5 text-xs bg-[#0D0C1D]/60 p-3 rounded-lg border border-[#E5E5E5]/10">
                          <div>
                            <span className="text-[#FFB020] font-bold text-[10px] uppercase flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-[#FFB020]" /> Dor Principal:
                            </span>
                            <p className="text-[#E5E5E5]/90 text-[11px] leading-relaxed mt-0.5">
                              "{p.keyPain}"
                            </p>
                          </div>

                          {p.desire && (
                            <div className="pt-1 border-t border-[#E5E5E5]/10">
                              <span className="text-emerald-400 font-bold text-[10px] uppercase flex items-center gap-1">
                                <Heart className="w-3 h-3 text-emerald-400" /> Desejo / Transformação:
                              </span>
                              <p className="text-emerald-200/90 text-[11px] leading-relaxed mt-0.5">
                                "{p.desire}"
                              </p>
                            </div>
                          )}

                          {p.objection && (
                            <div className="pt-1 border-t border-[#E5E5E5]/10">
                              <span className="text-amber-400 font-bold text-[10px] uppercase flex items-center gap-1">
                                <ShieldAlert className="w-3 h-3 text-amber-400" /> Objeção Oculta:
                              </span>
                              <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                                "{p.objection}"
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="pt-1 flex items-center justify-between">
                          {!isSelected ? (
                            <Button
                              onClick={() => {
                                setSelectedPersonaId(p.id);
                                setActiveTab("generator");
                                toast.success(`Persona "${p.name}" selecionada! Redirecionando para o Gerador.`);
                              }}
                              variant="outline"
                              size="sm"
                              className="text-[11px] h-7 border-[#E5E5E5]/20 hover:border-[#FFB020] text-white hover:text-[#FFB020] bg-[#000000]/60 cursor-pointer"
                            >
                              Usar no Gerador 🚀
                            </Button>
                          ) : (
                            <span className="text-[11px] text-[#FFB020] font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Pronta no Gerador
                            </span>
                          )}
                          <span className="text-[10px] text-[#E5E5E5]/40 italic">
                            Tom: {p.tone?.split(",")[0] || "Profissional"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
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
                  {/* Banner de Aviso Amigável: Assinatura Cancelada com Histórico Preservado */}
                  {hasCanceledSub && (
                    <Card className="bg-[#1E1B4B] border-2 border-[#FFB020]/60 p-6 rounded-2xl shadow-xl space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FFB020]/50 flex items-center justify-center text-xl shadow-md">
                          ⚠️
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white flex items-center gap-2">
                            Assinatura Cancelada
                            <Badge className="bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/40 text-[10px]">
                              Sem novas cobranças
                            </Badge>
                          </h4>
                          <p className="text-xs text-[#E5E5E5]/70">
                            Sua assinatura foi cancelada. Não haverá novas cobranças no seu cartão.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 bg-[#000000]/40 rounded-xl border border-emerald-500/25 flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-white block mb-0.5">Seu Histórico Continua 100% Salvo</strong>
                            <span className="text-[#E5E5E5]/70 leading-relaxed">
                              Todas as suas pautas já criadas continuam disponíveis na <strong>Aba 2 (Histórico)</strong> para você consultar e copiar livremente quando quiser.
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 bg-[#000000]/40 rounded-xl border border-amber-500/25 flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 text-[#FFB020] shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-white block mb-0.5">Criação & Refinador Pausados</strong>
                            <span className="text-[#E5E5E5]/70 leading-relaxed">
                              A geração de novas pautas e os ajustes com IA foram pausados. Deseja voltar a produzir conteúdo ilimitado? Basta assinar novamente abaixo!
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

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

        {/* =========================================================================
            MODAL DE CADASTRO / EDIÇÃO DE PERSONA (COPYWRITING ESTRATÉGICO)
           ========================================================================= */}
        <Dialog open={isPersonaModalOpen} onOpenChange={setIsPersonaModalOpen}>
          <DialogContent className="bg-[#1E1B4B] border border-[#FFB020]/50 text-white w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-6 md:p-8 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-1.5 pb-2 border-b border-[#E5E5E5]/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#000000] border border-[#FFB020]/40 flex items-center justify-center text-[#FFB020]">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-white">
                    {editingPersonaId ? "Editar Persona / Cliente-Alvo" : "Nova Persona / Cliente-Alvo"}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#E5E5E5]/70">
                    Defina as dores e desejos reais para a IA criar copies cirúrgicas e persuasivas.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Coluna 1: Dados Cadastrais & Perfil */}
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-white">Nome ou Arquétipo da Persona *</Label>
                      <Input
                        placeholder="Ex: Mariana ou Noiva Ansiosa"
                        value={personaForm.name}
                        onChange={(e) => setPersonaForm({ ...personaForm, name: e.target.value })}
                        className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white text-xs h-9 focus-visible:ring-[#FFB020]"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-white">Nicho / Categoria</Label>
                      <Input
                        placeholder="Ex: Estética, Gastronomia, Saúde..."
                        value={personaForm.category}
                        onChange={(e) => setPersonaForm({ ...personaForm, category: e.target.value })}
                        className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white text-xs h-9 focus-visible:ring-[#FFB020]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-white">Perfil Demográfico & Comportamento</Label>
                    <Textarea
                      placeholder="Ex: Mulher de 35 anos, empresária, sem tempo e buscando procedimentos rápidos"
                      value={personaForm.role}
                      onChange={(e) => setPersonaForm({ ...personaForm, role: e.target.value })}
                      rows={2}
                      className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white text-xs focus-visible:ring-[#FFB020] rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-white">Tom de Voz Específico para esta Persona</Label>
                    <Input
                      placeholder="Ex: Acolhedor, elegante, empático e autoridade científica simples"
                      value={personaForm.tone}
                      onChange={(e) => setPersonaForm({ ...personaForm, tone: e.target.value })}
                      className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white text-xs h-9 focus-visible:ring-[#FFB020]"
                    />
                  </div>
                </div>

                {/* Coluna 2: Gatilhos Psicológicos de Copy & Dores */}
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <Label className="text-xs text-[#FFB020] font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-[#FFB020]" />
                      <span>Dor Principal / Frustração que tira o sono dela *</span>
                    </Label>
                    <Textarea
                      placeholder="Ex: Medo de dor durante o procedimento e receio de ficar com resultado artificial..."
                      value={personaForm.keyPain}
                      onChange={(e) => setPersonaForm({ ...personaForm, keyPain: e.target.value })}
                      rows={2}
                      className="bg-[#000000]/60 border-[#FFB020]/30 text-white text-xs focus-visible:ring-[#FFB020] rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <Heart className="w-3 h-3 text-emerald-400" />
                      <span>Maior Desejo / Transformação que ela busca alcançar</span>
                    </Label>
                    <Textarea
                      placeholder="Ex: Ter um sorriso brilhante para fotos do casamento sem sentir sensibilidade..."
                      value={personaForm.desire}
                      onChange={(e) => setPersonaForm({ ...personaForm, desire: e.target.value })}
                      rows={2}
                      className="bg-[#000000]/60 border-emerald-500/30 text-white text-xs focus-visible:ring-emerald-500 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-amber-400 font-bold flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-amber-400" />
                      <span>Objeção Oculta que a IA DEVE quebrar na copy</span>
                    </Label>
                    <Textarea
                      placeholder="Ex: Acha que vai doer demais, que vai ficar artificial ou que é caro demais..."
                      value={personaForm.objection}
                      onChange={(e) => setPersonaForm({ ...personaForm, objection: e.target.value })}
                      rows={2}
                      className="bg-[#000000]/60 border-amber-500/30 text-white text-xs focus-visible:ring-amber-500 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-[#E5E5E5]/10">
                <Button
                  type="button"
                  onClick={() => setIsPersonaModalOpen(false)}
                  variant="outline"
                  size="sm"
                  className="border-[#E5E5E5]/20 text-white hover:bg-[#000000]/60 text-xs h-9 px-4 cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleSavePersona}
                  size="sm"
                  className="bg-[#FFB020] hover:bg-[#FFB020]/90 text-black font-bold text-xs h-9 px-5 rounded-xl cursor-pointer shadow-lg shadow-[#FFB020]/20"
                >
                  {editingPersonaId ? "Salvar Alterações" : "Cadastrar Persona"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
