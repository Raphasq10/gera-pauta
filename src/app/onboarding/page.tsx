"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Users2, 
  Trophy, 
  CheckCircle2, 
  RefreshCw,
  Sliders,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { businessProfileSchema, type BusinessProfileInput } from "@/lib/schemas/business";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // React Hook Form com validação estrita Zod
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<BusinessProfileInput>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      companyName: "",
      niche: "Clínica Odontológica & Estética",
      toneOfVoice: "Profissional, acolhedor e seguro",
      targetAudience: "Mulheres e homens de 25 a 45 anos que buscam autocuidado e estética dental",
      keyPain: "Medo de dor durante o procedimento e receio de tratamentos caros e artificiais",
      differential: "Tecnologia a laser moderna sem dor, atendimento humanizado e horário pontual",
    },
    mode: "onBlur",
  });

  const watchedNiche = watch("niche");
  const watchedTone = watch("toneOfVoice");

  // Carrega nome salvo no cadastro ou perfil existente
  useEffect(() => {
    async function loadInitialContext() {
      if (typeof window !== "undefined") {
        const cachedCompany = localStorage.getItem("gera_pauta_company_name");
        if (cachedCompany) setValue("companyName", cachedCompany);
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: business } = await supabase
            .from("businesses")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (business) {
            if (business.company_name) setValue("companyName", business.company_name);
            if (business.niche) setValue("niche", business.niche);
            if (business.tone_of_voice) setValue("toneOfVoice", business.tone_of_voice);
            if (business.key_pain) setValue("keyPain", business.key_pain);
            if (business.differential) setValue("differential", business.differential);
          }
        }
      } catch (err) {
        console.warn("Não foi possível carregar perfil anterior:", err);
      }
    }
    loadInitialContext();
  }, [setValue]);

  // Avança para o próximo passo validando apenas os campos da etapa atual
  const handleNextStep = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await trigger(["companyName", "niche"]);
    } else if (step === 2) {
      isValid = await trigger(["targetAudience", "keyPain"]);
    }

    if (isValid) {
      setStep((prev) => prev + 1);
    } else {
      toast.error("Por favor, preencha os campos obrigatórios deste passo.");
    }
  };

  // SUBMISSÃO FINAL AO BACKEND
  const onFinalSubmit = async (data: BusinessProfileInput) => {
    try {
      const response = await fetch("/api/business/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (!response.ok) {
        toast.error(json.error || "Não foi possível salvar o perfil.");
        return;
      }

      // Salva em cache local para uso imediato pelo painel
      if (typeof window !== "undefined") {
        localStorage.setItem("gera_pauta_business_context", JSON.stringify({
          ...data,
          updatedAt: new Date().toISOString(),
        }));
        localStorage.setItem("gera_pauta_company_name", data.companyName);
      }

      toast.success("Memória de marca salva com sucesso! Abrindo seu gerador...");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Erro ao salvar perfil. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0C1D] text-white flex flex-col justify-center items-center px-4 py-12 selection:bg-[#FFB020]/30">
      
      {/* Logo Oficial Gera Pauta */}
      <div className="mb-6 flex justify-center">
        <img 
          src="/images/logo.png" 
          alt="Gera Pauta" 
          className="h-10 w-auto object-contain drop-shadow" 
        />
      </div>

      {/* Barra de Progresso Superior */}
      <div className="w-full max-w-xl mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold text-slate-300">Configuração da sua Marca</span>
          <span className="text-[#FFB020] font-mono font-black">Passo {step} de 3</span>
        </div>
        <div className="w-full h-1.5 bg-[#1E1B4B] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#5B5BF7] to-[#FFB020] transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <Card className="w-full max-w-xl bg-[#1E1B4B] border border-[#2A2A3A] p-6 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur">
        {/* Glow no topo */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5B5BF7] via-[#FFB020] to-[#5B5BF7]" />

        <form onSubmit={handleSubmit(onFinalSubmit)}>
          
          {/* ========================================================
              PASSO 1: DADOS BÁSICOS DA EMPRESA & NICHO
          ======================================================== */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D0C1D] border border-[#FFB020]/40 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#FFB020]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Sobre a sua Marca ou Cliente</h2>
                  <p className="text-xs text-slate-300">Defina o nome comercial e o mercado de atuação.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="companyName">Nome do seu Negócio / Marca *</Label>
                  <Input
                    id="companyName"
                    type="text"
                    maxLength={100}
                    placeholder="Ex: Capi Webcraft / Clínica Sorriso & Arte"
                    {...register("companyName")}
                    className="bg-[#0D0C1D] border-[#2A2A3A] text-white placeholder:text-slate-500 focus-visible:ring-[#FFB020] h-11 text-sm"
                  />
                  {errors.companyName && (
                    <p className="text-[11px] text-rose-400 font-medium">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="niche">Nicho / Área de Atuação *</Label>
                  <Input
                    id="niche"
                    type="text"
                    maxLength={100}
                    placeholder="Ex: Desenvolvimento Web & Design / Odontologia Estética"
                    {...register("niche")}
                    className="bg-[#0D0C1D] border-[#2A2A3A] text-white placeholder:text-slate-500 focus-visible:ring-[#FFB020] h-11 text-sm"
                  />
                  {errors.niche && (
                    <p className="text-[11px] text-rose-400 font-medium">
                      {errors.niche.message}
                    </p>
                  )}
                </div>

                {/* Chips de Sugestões de Nicho */}
                <div className="pt-2">
                  <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                    Sugestões rápidas de nichos (clique para aplicar):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Desenvolvimento Web & Design",
                      "Clínica Odontológica",
                      "Hamburgueria Gourmet",
                      "Advocacia Trabalhista",
                      "Studio de Pilates & Fitness",
                      "Estética Avançada & Spa",
                      "Contabilidade & Gestão",
                      "Imobiliária & Corretores"
                    ].map((example) => (
                      <Badge
                        key={example}
                        onClick={() => setValue("niche", example, { shouldValidate: true })}
                        className={`text-xs py-1 px-2.5 cursor-pointer transition-colors ${
                          watchedNiche === example
                            ? "bg-[#FFB020] text-black font-bold"
                            : "bg-[#0D0C1D] hover:bg-slate-800 border border-[#2A2A3A] text-slate-200"
                        }`}
                      >
                        + {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              PASSO 2: PÚBLICO-ALVO & DOR/OBJEÇÃO PRINCIPAL
          ======================================================== */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D0C1D] border border-[#FFB020]/40 flex items-center justify-center">
                  <Users2 className="w-5 h-5 text-[#FFB020]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Quem é o seu Cliente Ideal?</h2>
                  <p className="text-xs text-slate-300">
                    A IA usa essas dores reais para criar ganchos de alta conversão para parar o scroll.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="targetAudience">Perfil do Público (Idade, profissão, perfil de compra) *</Label>
                  <Input
                    id="targetAudience"
                    type="text"
                    maxLength={300}
                    placeholder="Ex: Empreendedores e donos de pequenas empresas que precisam de um site profissional"
                    {...register("targetAudience")}
                    className="bg-[#0D0C1D] border-[#2A2A3A] text-white placeholder:text-slate-500 focus-visible:ring-[#FFB020] h-11 text-sm"
                  />
                  {errors.targetAudience && (
                    <p className="text-[11px] text-rose-400 font-medium">
                      {errors.targetAudience.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="keyPain">Qual a maior dor, medo ou objeção desse cliente ao comprar? *</Label>
                  <Textarea
                    id="keyPain"
                    maxLength={500}
                    rows={3}
                    placeholder="Ex: Medo de pagar caro e receber um site feio ou demorado; já teve trauma com programadores que sumiram."
                    {...register("keyPain")}
                    className="bg-[#0D0C1D] border-[#2A2A3A] text-white placeholder:text-slate-500 focus-visible:ring-[#FFB020] text-sm resize-none"
                  />
                  {errors.keyPain && (
                    <p className="text-[11px] text-rose-400 font-medium">
                      {errors.keyPain.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              PASSO 3: TOM DE VOZ & DIFERENCIAIS COMPETITIVOS
          ======================================================== */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D0C1D] border border-[#FFB020]/40 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-[#FFB020]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Tom de Voz & Diferenciais</h2>
                  <p className="text-xs text-slate-300">
                    Como a sua marca se comunica e por que o cliente deve escolher você.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="toneOfVoice">Tom de Voz da Marca *</Label>
                  <Input
                    id="toneOfVoice"
                    type="text"
                    maxLength={150}
                    placeholder="Ex: Moderno, confiável, direto ao ponto e focado em resultados"
                    {...register("toneOfVoice")}
                    className="bg-[#0D0C1D] border-[#2A2A3A] text-white placeholder:text-slate-500 focus-visible:ring-[#FFB020] h-11 text-sm"
                  />
                  {errors.toneOfVoice && (
                    <p className="text-[11px] text-rose-400 font-medium">
                      {errors.toneOfVoice.message}
                    </p>
                  )}
                </div>

                {/* Chips de Tom de Voz */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    "Profissional e acolhedor",
                    "Direto, moderno e inovador",
                    "Elegante, exclusivo e nobre",
                    "Educativo, seguro e autoritário",
                    "Descontraído e bem-humorado"
                  ].map((tone) => (
                    <Badge
                      key={tone}
                      onClick={() => setValue("toneOfVoice", tone, { shouldValidate: true })}
                      className={`text-[11px] py-1 px-2.5 cursor-pointer transition-colors ${
                        watchedTone === tone
                          ? "bg-[#FFB020] text-black font-bold"
                          : "bg-[#0D0C1D] hover:bg-slate-800 border border-[#2A2A3A] text-slate-300"
                      }`}
                    >
                      {tone}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label htmlFor="differential">Qual é o seu principal Diferencial Competitivo? *</Label>
                  <Textarea
                    id="differential"
                    maxLength={500}
                    rows={3}
                    placeholder="Ex: Entrega em 7 dias com garantia de suporte, design exclusivo sem templates genéricos e foco total em conversão no WhatsApp."
                    {...register("differential")}
                    className="bg-[#0D0C1D] border-[#2A2A3A] text-white placeholder:text-slate-500 focus-visible:ring-[#FFB020] text-sm resize-none"
                  />
                  {errors.differential && (
                    <p className="text-[11px] text-rose-400 font-medium">
                      {errors.differential.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              BOTÕES DE NAVEGAÇÃO E SUBMISSÃO (COM RACE CONDITION DEFENSE)
          ======================================================== */}
          <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-[#2A2A3A]">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setStep((prev) => prev - 1)}
                className="border-[#2A2A3A] bg-[#0D0C1D] text-white hover:bg-[#1E1B4B] h-11 px-4 rounded-xl text-xs gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNextStep}
                className="bg-[#FFB020] hover:bg-[#FFB020]/90 text-black font-extrabold h-11 px-6 rounded-xl text-xs shadow-lg shadow-[#FFB020]/20 gap-2 cursor-pointer ml-auto"
              >
                Avançar <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#FFB020] hover:bg-[#FFB020]/90 text-black font-extrabold h-11 px-7 rounded-xl text-xs shadow-xl shadow-[#FFB020]/25 gap-2 cursor-pointer ml-auto"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Salvando Memória de Marca...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Salvar Perfil & Ir ao Gerador <Sparkles className="w-4 h-4" />
                  </span>
                )}
              </Button>
            )}
          </div>

        </form>
      </Card>
    </div>
  );
}
