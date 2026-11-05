"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ArrowLeft, Building2, MessageSquare, Users2, Trophy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Estados do Contexto do Negócio
  const [companyName, setCompanyName] = useState("");
  const [niche, setNiche] = useState("Clínica Odontológica & Estética");
  const [toneOfVoice, setToneOfVoice] = useState("Profissional, acolhedor e seguro");
  const [targetAudience, setTargetAudience] = useState("Mulheres e homens de 25 a 45 anos que buscam autocuidado");
  const [keyPain, setKeyPain] = useState("Medo de dor durante o procedimento e medo de resultados artificiais");
  const [differential, setDifferential] = useState("Tecnologia moderna a laser sem dor e atendimento humanizado com horário pontual");

  const handleNext = () => {
    if (step === 1 && (!companyName.trim() || !niche.trim())) {
      toast.error("Por favor, preencha o nome da sua empresa e o seu nicho.");
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    const businessContext = {
      companyName: companyName.trim() || "Minha Empresa",
      niche,
      toneOfVoice,
      targetAudience,
      keyPain,
      differential,
      updatedAt: new Date().toISOString()
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("gera_pauta_business_context", JSON.stringify(businessContext));
    }

    try {
      // Salva no banco de dados do Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("businesses").insert({
          user_id: user.id,
          company_name: companyName.trim() || "Minha Empresa",
          niche,
          tone_of_voice: toneOfVoice,
          key_pain: keyPain,
          differential
        });
      }
    } catch (e) {
      console.warn("Contexto salvo localmente:", e);
    } finally {
      setSaving(false);
      toast.success("Perfil do negócio salvo com sucesso no Supabase! Abrindo seu gerador de pautas...");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-center items-center px-4 py-12 selection:bg-[#FCA311]/30">
      {/* Barra de Progresso Superior */}
      <div className="w-full max-w-xl mb-8">
        <div className="flex items-center justify-between text-xs text-[#E5E5E5]/70 mb-2">
          <span>Configuração do Negócio</span>
          <span className="text-[#FCA311] font-mono font-bold">Passo {step} de 3</span>
        </div>
        <div className="w-full h-1.5 bg-[#14213D] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FCA311] transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <Card className="w-full max-w-xl bg-[#14213D] border border-[#E5E5E5]/15 p-6 sm:p-10 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur">
        {/* Glow dourado */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#14213D] via-[#FCA311] to-[#14213D]" />

        {/* PASSO 1: DADOS BÁSICOS DA EMPRESA */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FCA311]/40 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#FCA311]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Sobre a sua Empresa ou Marca</h2>
                <p className="text-xs text-[#E5E5E5]/70">Defina o nome e o segmento do seu negócio.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="company">Nome do seu Negócio / Cliente</Label>
                <Input
                  id="company"
                  type="text"
                  maxLength={100}
                  placeholder="Ex: Clínica Sorriso & Bem-Estar"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white placeholder:text-[#E5E5E5]/40 focus-visible:ring-[#FCA311] h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="niche">Nicho / Área de Atuação</Label>
                <Input
                  id="niche"
                  type="text"
                  maxLength={100}
                  placeholder="Ex: Odontologia Estética / Hamburgueria Artesanal / Advocacia"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white placeholder:text-[#E5E5E5]/40 focus-visible:ring-[#FCA311] h-11"
                />
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-[#E5E5E5]/60 block mb-2 font-medium">Exemplos rápidos de nicho para clicar:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Clínica Odontológica",
                    "Hamburgueria Gourmet",
                    "Advocacia Trabalhista",
                    "Studio de Pilates",
                    "E-commerce de Roupas"
                  ].map((example) => (
                    <Badge
                      key={example}
                      onClick={() => setNiche(example)}
                      className="bg-[#000000]/60 hover:bg-[#FCA311]/20 hover:text-[#FCA311] border border-[#E5E5E5]/20 text-xs py-1 px-2.5 cursor-pointer text-[#E5E5E5]"
                    >
                      + {example}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PASSO 2: PÚBLICO-ALVO & DOR PRINCIPAL */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FCA311]/40 flex items-center justify-center">
                <Users2 className="w-5 h-5 text-[#FCA311]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Quem é o seu Cliente Ideal?</h2>
                <p className="text-xs text-[#E5E5E5]/70">A IA vai usar essas dores reais para criar ganchos de alta conversão.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="audience">Perfil do Público (Idade, estilo de vida)</Label>
                <Input
                  id="audience"
                  type="text"
                  maxLength={200}
                  placeholder="Ex: Jovens profissionais que almoçam fora / Pacientes de 30 a 50 anos"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white placeholder:text-[#E5E5E5]/40 focus-visible:ring-[#FCA311] h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="keyPain">Qual a maior dor, medo ou dúvida desse cliente?</Label>
                <Textarea
                  id="keyPain"
                  maxLength={500}
                  rows={3}
                  placeholder="Ex: Medo de procedimentos dolorosos; acha que é muito caro; não confia em tratamentos rápidos."
                  value={keyPain}
                  onChange={(e) => setKeyPain(e.target.value)}
                  className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white placeholder:text-[#E5E5E5]/40 focus-visible:ring-[#FCA311] text-sm resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* PASSO 3: TOM DE VOZ & DIFERENCIAL */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FCA311]/40 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[#FCA311]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Tom de Voz & Diferenciais</h2>
                <p className="text-xs text-[#E5E5E5]/70">Como sua marca deve soar e por que o cliente deve escolher você.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="tone">Tom de Voz da Marca</Label>
                <Input
                  id="tone"
                  type="text"
                  maxLength={150}
                  placeholder="Ex: Acolhedor, elegante, profissional e empático"
                  value={toneOfVoice}
                  onChange={(e) => setToneOfVoice(e.target.value)}
                  className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white placeholder:text-[#E5E5E5]/40 focus-visible:ring-[#FCA311] h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="diff">Qual é o seu principal Diferencial?</Label>
                <Textarea
                  id="diff"
                  maxLength={500}
                  rows={3}
                  placeholder="Ex: Tecnologia a laser sem dor, garantia de 1 ano, entrega em menos de 30 minutos."
                  value={differential}
                  onChange={(e) => setDifferential(e.target.value)}
                  className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white placeholder:text-[#E5E5E5]/40 focus-visible:ring-[#FCA311] text-sm resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-[#E5E5E5]/15">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="border-[#E5E5E5]/20 bg-[#000000]/40 text-white hover:bg-[#000000] h-10 px-4 rounded-xl text-xs gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="button"
            onClick={handleNext}
            className="bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-bold h-10 px-5 rounded-xl text-xs shadow-lg shadow-[#FCA311]/20 gap-2 cursor-pointer ml-auto"
          >
            {step === 3 ? (
              <span className="flex items-center gap-1.5">
                Finalizar & Ir ao Gerador <Sparkles className="w-4 h-4" />
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Avançar <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
