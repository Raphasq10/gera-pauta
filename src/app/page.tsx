"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  Layers, 
  ShieldCheck, 
  Zap, 
  Copy, 
  Check,
  MessageCircle, 
  Share2, 
  Briefcase, 
  Video,
  ChevronDown, 
  Flame, 
  Target, 
  Cpu, 
  Smartphone,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function HomePage() {
  // Estado para FAQ Interativo
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedHeadline, setCopiedHeadline] = useState<string | null>(null);

  // Canais interativos do mockup do Hero
  const [mockupChannel, setMockupChannel] = useState<"instagram" | "whatsapp" | "linkedin" | "tiktok">("instagram");
  const [mockupGoal, setMockupGoal] = useState<"vendas" | "comentarios" | "autoridade">("vendas");

  const handleCopyMockup = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHeadline(text);
    toast.success("Headline copiada para a área de transferência!");
    setTimeout(() => setCopiedHeadline(null), 2000);
  };

  const faqs = [
    {
      q: "Preciso ter conhecimento de engenharia de prompt ou inteligência artificial?",
      a: "Absolutamente não! O Gera Pauta foi desenhado especificamente para quem não é da área de tecnologia. Você não precisa inventar comandos complicados nem testar dezenas de prompts: basta selecionar seu objetivo, digitar uma ideia rápida (ou deixar em branco) e a nossa IA contextualizada monta a pauta completa em segundos."
    },
    {
      q: "O Gera Pauta funciona para o meu nicho específico de atuação?",
      a: "Sim! A nossa inteligência de negócio foi treinada com dados reais de dezenas de mercados: consultórios odontológicos, clínicas médicas, escritórios de advocacia, contabilidade, hamburguerias, restaurantes, studios de pilates, estética, e-commerce e prestadores de serviço locais. Você cadastra o seu nicho uma única vez e a IA calibra o tom imediatamente."
    },
    {
      q: "Por que o Gera Pauta é muito melhor do que usar o ChatGPT gratuito?",
      a: "O ChatGPT é uma ferramenta genérica sem memória: toda vez você precisa reexplicar quem é sua empresa, e ele costuma sugerir textos robóticos sem gancho comercial. O Gera Pauta entrega a estrutura 360° exata que o seu negócio precisa: o Mote estratégico, 2 opções de Headline para diagramar na arte do Canva, a Legenda completa com CTA para o seu WhatsApp e o Formato com justificativa."
    },
    {
      q: "Como funciona a degustação gratuita e o cancelamento do Plano Pro?",
      a: "Você ganha 5 pautas completas gratuitas imediatamente ao criar sua conta, sem precisar cadastrar cartão de crédito. Se optar pelo Plano Pro (R$ 47/mês), a cobrança é mensal e você pode cancelar a qualquer momento com 1 clique direto no painel, sem multas ou fidelidade."
    }
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-[#FCA311]/30 scroll-smooth">
      {/* 1. HEADER FLUTUANTE (GLASSMORPHISM NAVBAR) */}
      <header className="sticky top-4 z-50 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <nav className="bg-[#14213D]/70 backdrop-blur-xl border border-[rgba(229,229,229,0.12)] px-4 sm:px-6 py-3 rounded-2xl flex items-center justify-between shadow-2xl shadow-black/80">
          {/* Logo GP */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#000000] to-[#14213D] border border-[#FCA311]/40 flex items-center justify-center font-black text-[#FCA311] text-base shadow-lg shadow-[#FCA311]/15 group-hover:scale-105 transition-all">
              GP
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white block leading-tight">
                Gera Pauta
              </span>
              <span className="text-[10px] text-[#E5E5E5]/70 block tracking-wider uppercase font-medium">
                Editorial AI
              </span>
            </div>
          </Link>

          {/* Links de Navegação Discretos */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#E5E5E5]/80">
            <a href="#como-funciona" className="hover:text-[#FCA311] transition-colors">Como Funciona</a>
            <a href="#comparativo" className="hover:text-[#FCA311] transition-colors">Comparativo</a>
            <a href="#recursos" className="hover:text-[#FCA311] transition-colors">Recursos</a>
            <a href="#precos" className="hover:text-[#FCA311] transition-colors">Preços</a>
            <a href="#faq" className="hover:text-[#FCA311] transition-colors">FAQ</a>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-[#E5E5E5] hover:text-[#FCA311] hover:bg-[#000000]/40 font-semibold cursor-pointer h-9 px-3.5"
              >
                Entrar
              </Button>
            </Link>

            <Link href="/login">
              <Button
                size="sm"
                className="relative group overflow-hidden bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-extrabold text-xs h-9 px-4 rounded-xl shadow-lg shadow-[#FCA311]/25 cursor-pointer transition-all hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Testar 5 Pautas Grátis <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* 2. HERO SECTION CINEMÁTICA */}
      <section className="relative px-4 sm:px-6 pt-16 pb-20 max-w-7xl mx-auto w-full flex flex-col items-center text-center overflow-hidden">
        {/* Glows de Fundo Atmosféricos (Mesh Lights) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#FCA311]/15 to-[#14213D]/40 blur-[140px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#FCA311]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Pill Badge Pulsante */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14213D] border border-[#FCA311]/40 text-[#FCA311] text-xs font-semibold mb-8 shadow-xl backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FCA311] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FCA311]"></span>
          </span>
          <span className="flex items-center gap-1.5 font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#FCA311]" /> O fim das ideias genéricas do ChatGPT
          </span>
        </div>

        {/* Headline Gigante com Tipografia Display */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl leading-[1.08]">
          Pautas para redes sociais que <span className="bg-gradient-to-r from-[#FCA311] via-[#FFBE53] to-[#FCA311] bg-clip-text text-transparent underline decoration-[#FCA311]/30 underline-offset-8">atraem clientes reais</span> para o seu negócio.
        </h1>

        {/* Sub-headline Persuasiva */}
        <p className="text-sm sm:text-lg lg:text-xl text-[#E5E5E5]/80 max-w-3xl mt-6 leading-relaxed font-normal">
          Chega de bloqueio criativo e de pagar R$ 1.500/mês para agências. Em menos de 10 segundos, receba o <strong>Mote</strong>, <strong>2 Opções de Headline da Arte</strong> para o Canva, <strong>Legenda persuasiva</strong> e o <strong>Formato ideal</strong> com base nas dores do seu cliente.
        </p>

        {/* Dupla de CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto">
          <Link href="/login" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-black text-sm h-13 px-8 rounded-xl shadow-2xl shadow-[#FCA311]/30 cursor-pointer gap-2 transition-all hover:scale-105"
            >
              <Zap className="w-4 h-4 fill-black" /> Criar Minhas 5 Pautas Gratuitas
            </Button>
          </Link>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full border-[rgba(229,229,229,0.2)] bg-[#14213D] text-white hover:bg-[#000000] hover:text-[#FCA311] text-sm h-13 px-7 rounded-xl cursor-pointer transition-all"
            >
              Ver Demonstração Interativa
            </Button>
          </Link>
        </div>

        {/* Micro-prova Social */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 text-xs text-[#E5E5E5]/70">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Sem cartão de crédito
          </span>
          <span className="hidden sm:inline text-[#E5E5E5]/20">•</span>
          <span className="flex items-center gap-1.5 text-[#FCA311] font-medium">
            <Zap className="w-4 h-4" /> 5 pautas cortesia imediatas
          </span>
          <span className="hidden sm:inline text-[#E5E5E5]/20">•</span>
          <span className="flex items-center gap-1.5 text-white font-medium">
            <Smartphone className="w-4 h-4 text-blue-400" /> Pronto para Canva, Instagram & WhatsApp
          </span>
        </div>

        {/* 3. INTERACTIVE HERO PRODUCT MOCKUP (A "VITRINE DE OURO") */}
        <div className="mt-16 w-full max-w-4xl relative">
          {/* Efeito Glow atrás do Mockup */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FCA311]/30 via-[#14213D] to-[#FCA311]/20 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity -z-10" />

          <Card className="bg-[#14213D] border border-[rgba(229,229,229,0.18)] p-5 sm:p-8 rounded-3xl shadow-2xl text-left backdrop-blur-2xl relative overflow-hidden">
            {/* Topbar do Mockup */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(229,229,229,0.1)] pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-bold text-white tracking-wide">
                  Gera Pauta • Editor Contextual Inteligente
                </span>
              </div>
              <Badge className="bg-[#000000] text-[#FCA311] border border-[#FCA311]/40 text-xs font-mono font-bold py-1 px-3">
                Exemplo: Clínica Odontológica & Estética
              </Badge>
            </div>

            {/* Controles Interativos Rápidos dentro do Mockup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 bg-[#000000]/60 p-3 rounded-2xl border border-[rgba(229,229,229,0.08)]">
              {/* Canais */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-[#E5E5E5]/60 uppercase mr-1">Canal:</span>
                {[
                  { id: "instagram", label: "Instagram", icon: Share2 },
                  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
                  { id: "linkedin", label: "LinkedIn", icon: Briefcase }
                ].map((c) => {
                  const Icon = c.icon;
                  const isSel = mockupChannel === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setMockupChannel(c.id as any)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSel ? "bg-[#FCA311] text-black font-bold" : "text-[#E5E5E5]/70 hover:text-white"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" /> {c.label}
                    </button>
                  );
                })}
              </div>

              {/* Objetivo */}
              <div className="flex items-center gap-1.5 sm:justify-end">
                <span className="text-[11px] font-semibold text-[#E5E5E5]/60 uppercase mr-1">Objetivo:</span>
                <span className="text-xs bg-[#14213D] border border-[#FCA311]/30 text-[#FCA311] font-semibold px-2.5 py-1 rounded-lg">
                  📲 Chamar no WhatsApp / Agendamento
                </span>
              </div>
            </div>

            {/* O CARD DE PAUTA COMPLETO (4 BLOCOS) */}
            <div className="space-y-4 bg-[#000000]/40 p-5 rounded-2xl border border-[rgba(229,229,229,0.1)]">
              {/* 1. MOTE */}
              <div>
                <span className="text-[10px] font-bold text-[#FCA311] uppercase tracking-wider block mb-1">
                  1. MOTE ESTRATÉGICO
                </span>
                <p className="text-xs sm:text-sm text-[#E5E5E5] leading-relaxed">
                  Quebrar a maior objeção dos pacientes particulares: o medo da dor e da sensibilidade excessiva no clareamento dental, apresentando a evolução tecnológica como caminho seguro para sorrir sem travar.
                </p>
              </div>

              {/* 2. HEADLINE DA ARTE (2 OPÇÕES) */}
              <div className="p-3.5 bg-[#14213D] rounded-xl border border-[rgba(229,229,229,0.12)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#FCA311] uppercase tracking-wider">
                    2. HEADLINE DA ARTE (O QUE VAI ESCRITO NO CANVA / CAPA DO REELS)
                  </span>
                  <span className="text-[10px] text-[#E5E5E5]/50">2 variações magnéticas</span>
                </div>

                <div className="flex items-center justify-between gap-3 p-2.5 bg-[#000000]/80 rounded-lg border border-[#FCA311]/30">
                  <div>
                    <span className="text-[10px] text-[#FCA311] font-bold uppercase block">Opção A (Pergunta Provocativa):</span>
                    <p className="text-xs sm:text-sm font-extrabold text-white">
                      "Você ainda foge do clareamento por medo daquela dorzinha chata? ✨"
                    </p>
                  </div>
                  <Button
                    onClick={() => handleCopyMockup("Você ainda foge do clareamento por medo daquela dorzinha chata? ✨")}
                    size="sm"
                    className="bg-[#FCA311] text-black font-bold h-7 px-2.5 rounded-lg text-[10px] cursor-pointer shrink-0"
                  >
                    {copiedHeadline ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copiar
                  </Button>
                </div>

                <div className="flex items-center justify-between gap-3 p-2 bg-[#000000]/40 rounded-lg border border-[rgba(229,229,229,0.08)]">
                  <div>
                    <span className="text-[10px] text-[#E5E5E5]/60 font-semibold uppercase block">Opção B (Afirmação de Impacto):</span>
                    <p className="text-xs font-semibold text-[#E5E5E5]">
                      "O que ninguém te contou sobre a nova tecnologia de clareamento sem sensibilidade."
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. LEGENDA COM CTA OTIMIZADO */}
              <div>
                <span className="text-[10px] font-bold text-[#FCA311] uppercase tracking-wider block mb-1">
                  3. LEGENDA PERSUASIVA COM CTA PARA WHATSAPP
                </span>
                <div className="p-3 bg-[#14213D]/70 rounded-xl border border-[rgba(229,229,229,0.1)] text-xs text-[#E5E5E5] leading-relaxed whitespace-pre-line">
                  A verdade é que a odontologia evoluiu — e você não precisa mais sofrer para conquistar dentes mais brancos! 🦷✨
                  {"\n\n"}
                  Com o protocolo a laser com barreira fotoprotetora, clareamos até 4 tons com conforto absoluto, sem aquela sensibilidade que impedia você de tomar um café quente ou um sorvete no mesmo dia.
                  {"\n\n"}
                  📲 <strong>Pronto(a) para renovar seu sorriso antes do fim do mês?</strong> Toque no link da bio e envie uma mensagem direto para a nossa equipe no WhatsApp para checar horários!
                  {"\n\n"}
                  #OdontologiaModerna #ClareamentoSemDor #SorrisoRenovado #AutoEstima
                </div>
              </div>

              {/* 4. FORMATO E JUSTIFICATIVA ESTATÍSTICA */}
              <div className="p-3 bg-[#000000]/50 rounded-xl border border-[#FCA311]/20 flex items-start gap-2.5 text-xs text-[#E5E5E5]">
                <Target className="w-4 h-4 text-[#FCA311] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#FCA311]">4. Formato Ideal:</strong> Carrossel Educativo de 3 Lâminas ou Vídeo de 20s. 
                  <span className="text-[#E5E5E5]/70 block mt-0.5">
                    <strong>Por que este formato?</strong> Quebra a objeção clínica logo no primeiro slide e conduz o paciente até a segurança do agendamento sem travas financeiras.
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. SEÇÃO DE CONTRASTE BRUTAL ("O CHATGPT GENÉRICO VS. GERA PAUTA") */}
      <section id="comparativo" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-[rgba(229,229,229,0.12)]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-[#14213D] text-[#FCA311] border border-[#FCA311]/40 text-xs py-1 px-3 mb-4 font-bold">
            COMPARAÇÃO DIRETA
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Por que o ChatGPT não traz clientes para o seu negócio?
          </h2>
          <p className="text-sm sm:text-base text-[#E5E5E5]/70 mt-4 leading-relaxed">
            O ChatGPT é um assistente genérico. O Gera Pauta é um <strong>diretor de criação editorial</strong> que conhece o seu cliente local.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card Vermelho / Jeito Antigo */}
          <Card className="bg-[#14213D]/40 border border-rose-500/30 p-8 rounded-3xl space-y-6 relative overflow-hidden backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">O Jeito Antigo</span>
                <h3 className="text-xl font-black text-white">Usando ChatGPT Genérico</h3>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-[#E5E5E5]/80">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                <span><strong>Perde 40 minutos</strong> escrevendo prompts enormes toda vez porque a IA nunca lembra quem você é.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                <span><strong>Textos robóticos e artificiais</strong> ("Descubra a fascinante jornada da saúde bucal") que todo mundo pula no feed.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                <span><strong>Não sabe o que colocar na arte:</strong> entrega legendas soltas, mas você trava na hora de desenhar a capa no Canva.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                <span><strong>Zero foco em conversão:</strong> finaliza com CTAs bobas ("comente o que achou") em vez de direcionar para o WhatsApp.</span>
              </li>
            </ul>
          </Card>

          {/* Card Dourado / Com o Gera Pauta */}
          <Card className="bg-[#14213D] border-2 border-[#FCA311] p-8 rounded-3xl space-y-6 relative overflow-hidden shadow-2xl shadow-[#FCA311]/15 backdrop-blur">
            <div className="absolute top-0 right-0 bg-[#FCA311] text-black font-extrabold text-[10px] py-1 px-4 rounded-bl-xl tracking-wider uppercase">
              A Escolha dos Empreendedores
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FCA311]/50 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#FCA311]" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#FCA311] uppercase tracking-wider block">O Novo Padrão</span>
                <h3 className="text-xl font-black text-white">Com o Gera Pauta</h3>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-[#E5E5E5]">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#FCA311]/20 text-[#FCA311] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                <span><strong>Memória de Marca Permanente:</strong> seu nicho, tom e público ficam salvos para sempre no seu painel.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#FCA311]/20 text-[#FCA311] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                <span><strong>Headline da Arte pronta:</strong> 2 variações magnéticas prontas para colar na imagem ou gancho de tela do Reels.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#FCA311]/20 text-[#FCA311] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                <span><strong>Linguagem humana e persuasiva:</strong> ataca medos reais e quebra objeções de preço sem rodeios.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#FCA311]/20 text-[#FCA311] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                <span><strong>Pronto em 10 segundos:</strong> clique em copiar e mande para o designer ou poste no mesmo instante.</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 5. BENTO GRID DE FUNCIONALIDADES (LAYOUT 3x2 ASSIMÉTRICO) */}
      <section id="recursos" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-[rgba(229,229,229,0.12)]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-[#14213D] text-[#FCA311] border border-[#FCA311]/40 text-xs py-1 px-3 mb-4 font-bold">
            RECURSOS DE ELITE
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Tudo o que você precisa para dominar as redes do seu nicho.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bloco 1: Grande (Ocupa 2 colunas) */}
          <Card className="md:col-span-2 bg-[#14213D] border border-[rgba(229,229,229,0.12)] p-8 rounded-3xl relative overflow-hidden group hover:border-[#FCA311]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#000000] border border-[#FCA311]/30 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-[#FCA311]" />
            </div>
            <span className="text-xs font-bold text-[#FCA311] uppercase tracking-wider block mb-2">Setup Único</span>
            <h3 className="text-2xl font-black text-white">Memória de Marca Inteligente</h3>
            <p className="text-sm text-[#E5E5E5]/80 mt-2 max-w-xl leading-relaxed">
              Você cadastra o nome da sua empresa, seu tom de voz (acolhedor, formal, jovem) e as dores do seu cliente uma única vez. Todas as pautas geradas já nascem 100% afinadas com a sua autoridade.
            </p>
          </Card>

          {/* Bloco 2 */}
          <Card className="bg-[#14213D] border border-[rgba(229,229,229,0.12)] p-8 rounded-3xl relative overflow-hidden group hover:border-[#FCA311]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#000000] border border-[#FCA311]/30 flex items-center justify-center mb-6">
              <Layers className="w-6 h-6 text-[#FCA311]" />
            </div>
            <span className="text-xs font-bold text-[#FCA311] uppercase tracking-wider block mb-2">Design Ready</span>
            <h3 className="text-2xl font-black text-white">Pronto para o Canva</h3>
            <p className="text-sm text-[#E5E5E5]/80 mt-2 leading-relaxed">
              Entregamos a frase de impacto exata que interrompe o scroll do feed para você colocar na arte do Canva sem quebrar a cabeça.
            </p>
          </Card>

          {/* Bloco 3 */}
          <Card className="bg-[#14213D] border border-[rgba(229,229,229,0.12)] p-8 rounded-3xl relative overflow-hidden group hover:border-[#FCA311]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#000000] border border-[#FCA311]/30 flex items-center justify-center mb-6">
              <Share2 className="w-6 h-6 text-[#FCA311]" />
            </div>
            <span className="text-xs font-bold text-[#FCA311] uppercase tracking-wider block mb-2">Multicanal</span>
            <h3 className="text-2xl font-black text-white">Motor Multicanal</h3>
            <p className="text-sm text-[#E5E5E5]/80 mt-2 leading-relaxed">
              Alterne entre o Instagram (visual e direto), o LinkedIn (executivo e sério), WhatsApp ou TikTok com um único clique.
            </p>
          </Card>

          {/* Bloco 4: Largo (Ocupa 2 colunas) */}
          <Card className="md:col-span-2 bg-[#14213D] border border-[rgba(229,229,229,0.12)] p-8 rounded-3xl relative overflow-hidden group hover:border-[#FCA311]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#000000] border border-[#FCA311]/30 flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6 text-[#FCA311]" />
            </div>
            <span className="text-xs font-bold text-[#FCA311] uppercase tracking-wider block mb-2">Alta Disponibilidade</span>
            <h3 className="text-2xl font-black text-white">Arquitetura Híbrida & Cascata Anti-Queda</h3>
            <p className="text-sm text-[#E5E5E5]/80 mt-2 max-w-xl leading-relaxed">
              Conectamos múltiplos motores de ponta em cascata (Gemini Flash e Groq Llama 3.3 70B). Se uma rede oscilar, o sistema pula para a próxima instantaneamente. Zero telas brancas e entrega ininterrupta.
            </p>
          </Card>
        </div>
      </section>

      {/* 6. TABELA DE PREÇOS COM HIERARQUIA VISUAL */}
      <section id="precos" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-[rgba(229,229,229,0.12)]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-[#14213D] text-[#FCA311] border border-[#FCA311]/40 text-xs py-1 px-3 mb-4 font-bold">
            PLANOS SEM SURPRESAS
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Comece grátis e escale quando ver o resultado.
          </h2>
          <p className="text-sm sm:text-base text-[#E5E5E5]/70 mt-4 leading-relaxed">
            Sem pegadinhas, sem cobrança de tokens confusos e com cancelamento a qualquer momento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Plano Degustação */}
          <Card className="bg-[#14213D]/50 border border-[rgba(229,229,229,0.12)] p-8 rounded-3xl space-y-6 flex flex-col justify-between backdrop-blur">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#E5E5E5]/60 uppercase tracking-wider">Degustação</span>
              <h3 className="text-2xl font-black text-white">Plano Grátis</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">R$ 0</span>
                <span className="text-xs text-[#E5E5E5]/60">/para sempre</span>
              </div>
              <p className="text-xs text-[#E5E5E5]/70">Ideal para testar a qualidade das pautas no seu nicho antes de assinar.</p>
              
              <div className="border-t border-[rgba(229,229,229,0.1)] pt-4 space-y-3 text-xs text-[#E5E5E5]">
                <div className="flex items-center gap-2">✓ <strong>5 pautas estruturadas completas</strong></div>
                <div className="flex items-center gap-2">✓ 2 opções de headline da arte por pauta</div>
                <div className="flex items-center gap-2">✓ Acesso ao gerador multicanal</div>
                <div className="flex items-center gap-2">✓ Sem necessidade de cartão de crédito</div>
              </div>
            </div>

            <Link href="/login" className="w-full block pt-4">
              <Button
                variant="outline"
                className="w-full border-[rgba(229,229,229,0.2)] bg-[#000000]/40 text-white hover:bg-[#000000] hover:text-[#FCA311] h-12 rounded-xl text-xs font-bold cursor-pointer"
              >
                Começar com 5 Pautas Grátis
              </Button>
            </Link>
          </Card>

          {/* Plano PRO (Recomendado com Borda Dourada Acesa) */}
          <Card className="bg-[#14213D] border-2 border-[#FCA311] p-8 rounded-3xl space-y-6 flex flex-col justify-between relative shadow-2xl shadow-[#FCA311]/20">
            <div className="absolute -top-3.5 right-6">
              <Badge className="bg-[#FCA311] text-black font-black text-[10px] py-1 px-3 shadow-lg tracking-wider uppercase">
                🔥 MAIS ESCOLHIDO
              </Badge>
            </div>

            <div className="space-y-4">
              <span className="text-xs font-bold text-[#FCA311] uppercase tracking-wider">Ilimitado & Comercial</span>
              <h3 className="text-2xl font-black text-white">Plano Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">R$ 47</span>
                <span className="text-xs text-[#E5E5E5]/60">/mês</span>
              </div>
              <p className="text-xs text-[#E5E5E5]/70">Para empreendedores e criadores que postam toda semana com autoridade.</p>

              <div className="border-t border-[rgba(229,229,229,0.1)] pt-4 space-y-3 text-xs text-[#E5E5E5]">
                <div className="flex items-center gap-2"><strong className="text-[#FCA311]">✓ Pautas Ilimitadas com IA Inclusa</strong></div>
                <div className="flex items-center gap-2">✓ Múltiplos nichos e clientes salvos</div>
                <div className="flex items-center gap-2">✓ Refazer pauta ilimitado com 1 clique</div>
                <div className="flex items-center gap-2">✓ Histórico perpétuo no banco Supabase</div>
                <div className="flex items-center gap-2">✓ Campo opcional para chave própria (BYOK)</div>
                <div className="flex items-center gap-2">✓ Suporte prioritário via WhatsApp</div>
              </div>
            </div>

            <Link href="/login" className="w-full block pt-4">
              <Button
                className="w-full bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-black h-12 rounded-xl text-xs shadow-xl shadow-[#FCA311]/25 cursor-pointer gap-2 transition-all hover:scale-105"
              >
                Assinar Plano Pro Agora <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* 7. FAQ SANFONADO (ACCORDION ELEGANTE) */}
      <section id="faq" className="py-24 px-4 sm:px-6 max-w-4xl mx-auto w-full border-t border-[rgba(229,229,229,0.12)]">
        <div className="text-center mb-16">
          <Badge className="bg-[#14213D] text-[#FCA311] border border-[#FCA311]/40 text-xs py-1 px-3 mb-4 font-bold">
            DÚVIDAS FREQUENTES
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Perguntas & Respostas
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <Card
                key={idx}
                className="bg-[#14213D] border border-[rgba(229,229,229,0.12)] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:text-[#FCA311] transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-white leading-tight">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#FCA311] shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#E5E5E5]/80 leading-relaxed border-t border-[rgba(229,229,229,0.08)] pt-4">
                    {faq.a}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* 8. FOOTER IMERSIVO COM CTA FINAL */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <Card className="bg-gradient-to-br from-[#14213D] via-[#0B132B] to-[#000000] border border-[#FCA311]/40 p-10 sm:p-16 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FCA311]/10 blur-[100px] pointer-events-none rounded-full" />

          <span className="text-xs font-bold text-[#FCA311] uppercase tracking-wider block">
            Comece Hoje Mesmo
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-2xl mx-auto leading-tight">
            Pronto para nunca mais travar na hora de criar conteúdo?
          </h2>
          <p className="text-sm sm:text-base text-[#E5E5E5]/80 max-w-xl mx-auto leading-relaxed">
            Cadastre-se em menos de 30 segundos e gere suas primeiras 5 pautas contextualizadas com a inteligência do Gera Pauta.
          </p>

          <div className="pt-4 flex justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-black text-sm h-13 px-8 rounded-xl shadow-2xl shadow-[#FCA311]/30 cursor-pointer gap-2 transition-all hover:scale-105"
              >
                Experimentar 5 Pautas Gratuitas <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* FOOTER OFICIAL */}
      <footer className="border-t border-[rgba(229,229,229,0.12)] bg-[#000000] py-10 text-xs text-[#E5E5E5]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#14213D] border border-[#FCA311]/40 flex items-center justify-center font-bold text-[#FCA311] text-xs">
              GP
            </div>
            <span className="font-bold text-white">Gera Pauta</span>
            <span>• O Gerador Editorial Inteligente para Pequenos Negócios</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <Link href="/login" className="text-[#FCA311] font-semibold hover:underline">Acessar Conta</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
