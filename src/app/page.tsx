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
  ChevronDown, 
  Flame, 
  Target, 
  Cpu, 
  Smartphone,
  Star,
  TrendingUp,
  Building2,
  Sliders,
  Eye,
  MousePointerClick,
  Repeat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

// Dados interativos para o seletor de nichos ao vivo no Hero (Estilo Envato / Framer)
const NICHE_DEMOS = {
  odonto: {
    name: "Odontologia & Estética",
    icon: "🦷",
    mote: "Quebrar o mito de que clareamento dental causa dor ou sensibilidade excessiva.",
    headlineA: "O que NUNCA te contaram sobre o clareamento moderno sem dor.",
    headlineB: "Ainda com medo da sensibilidade? A odontologia mudou.",
    caption: "A maioria das pessoas adia o sonho de ter dentes mais brancos por traumas de técnicas antigas. 🦷✨ Hoje, o protocolo a laser com dessensibilizante protege o esmalte e garante conforto absoluto em sessão única.\n\nQuer descobrir se o seu dente é apto? Toque no link da bio e envie 'CLAREAMENTO' no nosso WhatsApp!",
    format: "Carrossel de 3 Lâminas (Mito vs. Verdade) com foto de caso real na última lâmina.",
    conversionTarget: "Agendamento de avaliação no WhatsApp"
  },
  burger: {
    name: "Hamburgueria Gourmet",
    icon: "🍔",
    mote: "Destaque do blend artesanal de costela desfiada e queijo brie maçaricado na quinta-feira.",
    headlineA: "Você não precisa esperar o sábado para comer o melhor burger da cidade.",
    headlineB: "Quinta do Smash: O segredo que a concorrência não revela.",
    caption: "Pão brioche selado na manteiga de garrafa, 180g de blend angus no ponto certo e muito queijo brie derretendo na sua tela. 🤤🔥\n\nSó hoje: pedindo pelo WhatsApp, o combo com batata rústica sai com 20% OFF. O cupom expira às 23h!",
    format: "Reels de 8 segundos com som de fritura (ASMR) + close do corte do burger.",
    conversionTarget: "Pedidos diretos pelo WhatsApp Delivery"
  },
  advocacia: {
    name: "Direito Trabalhista / PME",
    icon: "⚖️",
    mote: "Alertar empresários sobre os 3 erros mais caros na contratação de PJ que viram processo.",
    headlineA: "Contratar PJ sem estes 3 cuidados pode custar R$ 80.000 para a sua empresa.",
    headlineB: "O erro silencioso que 9 em cada 10 empresários cometem com prestadores.",
    caption: "A reforma facilitou a terceirização, mas a subordinação direta e horário fixo continuam sendo o prato cheio para passivos trabalhistas. 🚨\n\nProteja o caixa da sua empresa antes da notificação judicial chegar. Envie uma mensagem direta e solicite nosso checklist preventivo.",
    format: "Post estático minimalista com card corporativo de alto contraste.",
    conversionTarget: "Contato institucional para auditoria de compliance"
  },
  estetica: {
    name: "Studio de Estética & Spa",
    icon: "💅",
    mote: "Combater a frustração de quem gasta com cremes caros mas não vê melhora no melasma.",
    headlineA: "Por que aquele sérum de R$ 300 não está clareando as suas manchas?",
    headlineB: "Melasma tem controle: o passo que o skincare caseiro esqueceu.",
    caption: "O melasma é uma condição profunda que reage a calor e inflamação celular. Passar produtos na camada superficial sem tratar a barreira cutânea só gera frustração. ✨\n\nCriamos um protocolo exclusivo com ativos clareadores fotoestáveis. Restam apenas 4 horários para esta semana — garanta o seu pelo WhatsApp!",
    format: "Carrossel Antes x Depois com explicação científica simplificada.",
    conversionTarget: "Agendamento de consulta estética"
  }
};

export default function HomePage() {
  const [selectedNiche, setSelectedNiche] = useState<keyof typeof NICHE_DEMOS>("odonto");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedHeadline, setCopiedHeadline] = useState<string | null>(null);

  const activeDemo = NICHE_DEMOS[selectedNiche];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHeadline(text);
    toast.success("Copiado para a área de transferência!");
    setTimeout(() => setCopiedHeadline(null), 2000);
  };

  const faqs = [
    {
      q: "Preciso entender de comandos complicados de IA ou prompts gigantes?",
      a: "Não! Esse é o grande diferencial do Gera Pauta. Você não precisa digitar 'aja como um especialista em copywriting'. Você só clica no seu nicho, escolhe se quer vender pelo WhatsApp ou engajar no Instagram, e a IA entrega os 4 blocos prontos para publicação."
    },
    {
      q: "Como o Gera Pauta se diferencia do ChatGPT gratuito?",
      a: "O ChatGPT é genérico e esquece quem é sua marca a cada conversa. Ele costuma dar respostas longas e sem foco comercial. O Gera Pauta entrega a headline exata para você colocar na arte do Canva, o mote estratégico e uma legenda calibrada com chamada para ação real (WhatsApp ou direct)."
    },
    {
      q: "O que vem nas 5 pautas gratuitas?",
      a: "Você ganha acesso imediato a 5 gerações completas com Mote Estratégico, 2 Opções de Headline da Arte, Legenda com CTA e Sugestão de Formato com Justificativa. Não pedimos cartão de crédito para começar."
    },
    {
      q: "Como funciona a assinatura e cancelamento do Plano Pro?",
      a: "No plano mensal (R$ 47/mês) você tem pautas ilimitadas, múltiplos perfis de clientes e suporte. Não há fidelidade: você pode cancelar com 1 clique direto no painel quando quiser."
    }
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-[#FCA311]/30 scroll-smooth relative overflow-x-hidden">
      
      {/* BACKGROUND GRID PATTERN (ESTILO MODERN STARTUP / ENVATO) */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 z-0" 
        style={{
          backgroundImage: `radial-gradient(rgba(252, 163, 17, 0.25) 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />

      {/* GLOWS DE FUNDO ATMOSFÉRICOS */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#FCA311]/15 via-[#14213D]/25 to-transparent blur-[150px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 -right-40 w-[500px] h-[500px] bg-[#14213D]/40 blur-[180px] pointer-events-none z-0" />

      {/* 1. HEADER FLUTUANTE (GLASSMORPHISM NAVBAR) */}
      <header className="sticky top-4 z-50 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <nav className="bg-[#14213D]/70 backdrop-blur-2xl border border-[rgba(229,229,229,0.12)] px-4 sm:px-6 py-3 rounded-2xl flex items-center justify-between shadow-2xl shadow-black/90">
          {/* Logo GP com Gradiente Dourado */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#000000] via-[#14213D] to-[#000000] border border-[#FCA311]/50 flex items-center justify-center font-black text-[#FCA311] text-lg shadow-lg shadow-[#FCA311]/20 group-hover:scale-105 transition-transform">
              GP
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-white block leading-tight">
                  Gera Pauta
                </span>
                <span className="bg-[#FCA311]/20 text-[#FCA311] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#FCA311]/40">
                  AI 2.0
                </span>
              </div>
              <span className="text-[10px] text-[#E5E5E5]/60 block tracking-wider uppercase font-medium">
                Editorial para Negócios
              </span>
            </div>
          </Link>

          {/* Links Centrais Discretos */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#E5E5E5]/80">
            <a href="#demonstracao" className="hover:text-[#FCA311] transition-colors">Demonstração</a>
            <a href="#comparativo" className="hover:text-[#FCA311] transition-colors">ChatGPT vs GP</a>
            <a href="#recursos" className="hover:text-[#FCA311] transition-colors">Como Funciona</a>
            <a href="#precos" className="hover:text-[#FCA311] transition-colors">Planos</a>
            <a href="#faq" className="hover:text-[#FCA311] transition-colors">Dúvidas</a>
          </div>

          {/* CTAs */}
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
                className="relative group overflow-hidden bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-extrabold text-xs h-9 px-4 rounded-xl shadow-lg shadow-[#FCA311]/30 cursor-pointer transition-all hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Testar Grátis <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-all" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* 2. HERO SECTION CINEMÁTICA */}
      <section className="relative z-10 px-4 sm:px-6 pt-16 pb-16 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        
        {/* Top Pill Notification */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#14213D]/90 border border-[#FCA311]/40 text-[#FCA311] text-xs font-semibold mb-6 shadow-xl backdrop-blur-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FCA311] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FCA311]"></span>
          </span>
          <span className="text-[#E5E5E5] font-normal">Cansado das ideias genéricas do ChatGPT?</span>
          <span className="text-[#FCA311] font-bold flex items-center gap-1">
            Conheça o Gera Pauta <Sparkles className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Headline Gigante Silicon Valley */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl leading-[1.08]">
          Pautas para redes sociais que <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#FCA311] via-[#FFD166] to-[#FCA311] bg-clip-text text-transparent">
            trazem clientes reais
          </span> para o seu negócio.
        </h1>

        {/* Sub-headline Persuasiva */}
        <p className="text-base sm:text-xl text-[#E5E5E5]/80 max-w-3xl mt-6 leading-relaxed font-normal">
          Em menos de 10 segundos, receba a <strong>Headline da Arte para o Canva</strong>, o <strong>Mote Estratégico</strong> e a <strong>Legenda calibrada para o seu WhatsApp</strong>. Sem travar na tela em branco.
        </p>

        {/* Dupla de CTAs de Alto Contraste */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto">
          <Link href="/login" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-black text-sm h-14 px-8 rounded-xl shadow-2xl shadow-[#FCA311]/40 cursor-pointer gap-2 transition-all hover:scale-105"
            >
              <Zap className="w-4 h-4 fill-black" /> Criar Minhas 5 Pautas Gratuitas
            </Button>
          </Link>

          <a href="#demonstracao" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full border-[rgba(229,229,229,0.2)] bg-[#14213D] text-white hover:bg-[#000000] hover:text-[#FCA311] text-sm h-14 px-7 rounded-xl cursor-pointer transition-all"
            >
              <Eye className="w-4 h-4" /> Ver Demonstração Interativa
            </Button>
          </a>
        </div>

        {/* Mini Prova Social & Avaliações */}
        <div className="flex flex-wrap items-center justify-center gap-5 mt-8 text-xs text-[#E5E5E5]/75">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/80 border-2 border-[#000000] flex items-center justify-center text-[10px] font-bold text-white">DR</span>
              <span className="w-6 h-6 rounded-full bg-amber-500/80 border-2 border-[#000000] flex items-center justify-center text-[10px] font-bold text-black">HG</span>
              <span className="w-6 h-6 rounded-full bg-blue-500/80 border-2 border-[#000000] flex items-center justify-center text-[10px] font-bold text-white">ADV</span>
            </div>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-semibold text-white">4.9/5</span>
            <span className="text-[#E5E5E5]/50">(+850 negócios)</span>
          </div>

          <span className="hidden sm:inline text-[#E5E5E5]/20">•</span>

          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Sem cartão de crédito
          </span>

          <span className="hidden sm:inline text-[#E5E5E5]/20">•</span>

          <span className="flex items-center gap-1.5 text-[#FCA311] font-medium">
            <Zap className="w-4 h-4" /> 5 pautas cortesia imediatas
          </span>
        </div>

        {/* 3. INTERACTIVE HERO PRODUCT SHOWCASE COM SELETOR DE NICHOS */}
        <div id="demonstracao" className="mt-14 w-full max-w-5xl relative scroll-mt-24">
          
          {/* Floating Metric Badges ao redor do Mockup (Silicon Valley Design) */}
          <div className="hidden lg:flex items-center gap-2 absolute -top-5 -left-6 z-20 bg-[#14213D] border border-[rgba(229,229,229,0.15)] px-3.5 py-2 rounded-xl shadow-2xl backdrop-blur-xl animate-bounce duration-1000">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white">IA calibrada para vendas</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 absolute -bottom-4 -right-6 z-20 bg-[#14213D] border border-[#FCA311]/40 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-xl">
            <Zap className="w-4 h-4 text-[#FCA311]" />
            <span className="text-xs font-bold text-[#FCA311]">Pronto para a arte do Canva</span>
          </div>

          {/* Moldura do Software */}
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-[#FCA311]/30 via-[rgba(229,229,229,0.12)] to-[#14213D]/20 shadow-2xl shadow-black">
            <div className="bg-[#14213D]/95 backdrop-blur-2xl rounded-[22px] p-4 sm:p-7 border border-[rgba(229,229,229,0.1)] text-left">
              
              {/* Barra superior estilo MacOS Window */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(229,229,229,0.1)] pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono font-semibold text-[#E5E5E5]/70">
                    editor.gerapauta.com/v2/simulador-ao-vivo
                  </span>
                </div>
                
                <span className="text-[11px] font-bold text-[#FCA311] bg-[#000000] border border-[#FCA311]/30 px-3 py-1 rounded-full flex items-center gap-1">
                  <MousePointerClick className="w-3 h-3" /> Clique nos nichos abaixo para testar
                </span>
              </div>

              {/* Seletor Dinâmico de Nichos Interativo */}
              <div className="mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E5E5E5]/60 block mb-2">
                  Escolha o seu nicho para ver a IA em ação:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(NICHE_DEMOS) as Array<keyof typeof NICHE_DEMOS>).map((key) => {
                    const item = NICHE_DEMOS[key];
                    const isSelected = selectedNiche === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedNiche(key)}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-[#FCA311] border-[#FCA311] text-black font-extrabold shadow-lg shadow-[#FCA311]/25 scale-[1.02]" 
                            : "bg-[#000000]/60 border-[rgba(229,229,229,0.1)] text-white hover:border-[#FCA311]/40"
                        }`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <div className="truncate">
                          <p className="text-xs leading-tight truncate">{item.name}</p>
                          <span className={`text-[10px] ${isSelected ? "text-black/80" : "text-[#E5E5E5]/60"}`}>
                            Ver pauta
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* VISUALIZAÇÃO DA PAUTA EM 2 COLUNAS: A ARTE DO CANVA + A ESTRUTURA EDITORIAL */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Coluna 1: Preview da Arte do Canva (Simulação Visual de Post de Instagram) */}
                <div className="lg:col-span-5 bg-[#000000] border border-[rgba(229,229,229,0.12)] rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{activeDemo.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-white leading-none">{activeDemo.name}</p>
                          <span className="text-[10px] text-[#E5E5E5]/50">Feed Oficial • Patrocinado</span>
                        </div>
                      </div>
                      <Badge className="bg-[#FCA311]/20 text-[#FCA311] border-[#FCA311]/40 text-[10px] font-mono">
                        Arte Canva
                      </Badge>
                    </div>

                    {/* Simulação de Capa de Carrossel com a Headline de Gancho */}
                    <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-[#14213D] via-[#0b1324] to-[#000000] border border-[#FCA311]/30 p-5 flex flex-col justify-between relative overflow-hidden group">
                      <div className="flex justify-between items-center text-[10px] text-[#FCA311] font-mono font-bold tracking-widest uppercase">
                        <span>Passe para o lado ➔</span>
                        <span>01/03</span>
                      </div>

                      <div className="space-y-2">
                        <span className="inline-block text-[9px] bg-[#FCA311] text-black font-black uppercase px-2 py-0.5 rounded">
                          Gancho de Parada
                        </span>
                        <h4 className="text-lg sm:text-xl font-black text-white leading-tight">
                          "{activeDemo.headlineA}"
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#E5E5E5]/60">
                        <span>{activeDemo.name}</span>
                        <span className="text-[#FCA311]">Salvar post 🔖</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#E5E5E5]/70">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Check className="w-3.5 h-3.5" /> Foco: {activeDemo.conversionTarget}
                    </span>
                  </div>
                </div>

                {/* Coluna 2: Os 4 Blocos da Pauta Estratégica */}
                <div className="lg:col-span-7 space-y-3.5 bg-[#000000]/40 p-4 rounded-2xl border border-[rgba(229,229,229,0.1)]">
                  
                  {/* Bloco 1: Mote */}
                  <div className="p-3 rounded-xl bg-[#14213D]/60 border border-[rgba(229,229,229,0.08)]">
                    <span className="text-[10px] font-bold text-[#FCA311] uppercase tracking-wider block mb-1">
                      1. MOTE ESTRATÉGICO
                    </span>
                    <p className="text-xs text-[#E5E5E5] leading-relaxed">
                      {activeDemo.mote}
                    </p>
                  </div>

                  {/* Bloco 2: 2 Opções de Headline da Arte */}
                  <div className="p-3 rounded-xl bg-[#14213D]/60 border border-[rgba(229,229,229,0.08)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#FCA311] uppercase tracking-wider">
                        2. HEADLINE DA ARTE (PARA O CANVA / DESIGNER)
                      </span>
                    </div>

                    <div 
                      onClick={() => handleCopy(activeDemo.headlineA)}
                      className="p-2.5 bg-[#000000]/60 rounded-lg border border-[rgba(229,229,229,0.1)] text-xs text-white flex items-center justify-between group hover:border-[#FCA311] cursor-pointer transition-all"
                    >
                      <span><strong className="text-[#FCA311]">Opção A:</strong> "{activeDemo.headlineA}"</span>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-[#E5E5E5] group-hover:text-[#FCA311]">
                        {copiedHeadline === activeDemo.headlineA ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>

                    <div 
                      onClick={() => handleCopy(activeDemo.headlineB)}
                      className="p-2.5 bg-[#000000]/60 rounded-lg border border-[rgba(229,229,229,0.1)] text-xs text-white flex items-center justify-between group hover:border-[#FCA311] cursor-pointer transition-all"
                    >
                      <span><strong className="text-[#FCA311]">Opção B:</strong> "{activeDemo.headlineB}"</span>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-[#E5E5E5] group-hover:text-[#FCA311]">
                        {copiedHeadline === activeDemo.headlineB ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>

                  {/* Bloco 3: Legenda com CTA */}
                  <div className="p-3 rounded-xl bg-[#14213D]/60 border border-[rgba(229,229,229,0.08)]">
                    <span className="text-[10px] font-bold text-[#FCA311] uppercase tracking-wider block mb-1">
                      3. LEGENDA COM CTA DIRETA
                    </span>
                    <p className="text-xs text-[#E5E5E5]/90 whitespace-pre-line leading-relaxed font-sans">
                      {activeDemo.caption}
                    </p>
                  </div>

                  {/* Bloco 4: Formato */}
                  <div className="p-2.5 bg-[#000000]/60 rounded-xl border border-[rgba(229,229,229,0.08)] flex items-center gap-2 text-xs">
                    <span className="text-[10px] font-bold text-[#FCA311] uppercase whitespace-nowrap">
                      4. FORMATO:
                    </span>
                    <span className="text-[#E5E5E5]/80 text-xs">
                      {activeDemo.format}
                    </span>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>

      </section>

      {/* 4. MARQUEE / NICHOS ATENDIDOS */}
      <section className="py-10 border-y border-[rgba(229,229,229,0.1)] bg-[#050914] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold text-[#E5E5E5]/60 uppercase tracking-widest mb-6">
            Inteligência editorial adaptada para dezenas de mercados locais:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-xs font-medium text-white/90">
            {[
              "Clínicas Odontológicas",
              "Hamburguerias & Restaurantes",
              "Advocacia & Tributário",
              "Studios de Pilates & Crossfit",
              "Estética Avançada",
              "Contabilidade & BPO",
              "Imobiliárias & Corretores",
              "E-commerce Local",
              "Consultoria Financeira"
            ].map((niche, i) => (
              <span key={i} className="px-3.5 py-1.5 rounded-lg bg-[#14213D] border border-[rgba(229,229,229,0.12)] text-[#E5E5E5] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FCA311]" /> {niche}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SEÇÃO DE CONTRASTE BRUTAL ("O ChatGPT Genérico vs. Gera Pauta") */}
      <section id="comparativo" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 text-xs py-1 px-3">
            O Grande Erro
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Por que o ChatGPT não traz clientes para o seu balcão?
          </h2>
          <p className="text-sm sm:text-base text-[#E5E5E5]/75 leading-relaxed">
            O ChatGPT é um assistente de uso geral. Ele não foi programado para entender as dores do seu cliente local, a limitação de caracteres do Canva ou a conversão de um WhatsApp comercial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Esquerda: O Jeito Antigo (ChatGPT) */}
          <Card className="bg-[#0b0c10] border border-rose-500/20 p-6 sm:p-8 rounded-3xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">O Jeito Antigo (ChatGPT)</h3>
                <p className="text-xs text-rose-400/80">Prompts infinitos e resultados vazios</p>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-[#E5E5E5]/70">
              <li className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Perder 40 minutos</strong> criando e ajustando prompts gigantes que nunca acertam o tom da sua marca.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Textos robóticos e clichês como <em>"Prepare-se para uma jornada transformadora..."</em> que ninguém lê.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Você continua sem saber <strong>o que colocar escrito na arte do Canva</strong> para chamar atenção no feed.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>CTAs genéricas que pedem likes vazios em vez de enviar interessados para o WhatsApp da sua empresa.</span>
              </li>
            </ul>
          </Card>

          {/* Card Direita: Com o Gera Pauta */}
          <Card className="bg-[#14213D] border border-[#FCA311]/50 p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-2xl shadow-[#FCA311]/10">
            <div className="absolute top-0 right-0 bg-[#FCA311] text-black text-[10px] font-black uppercase px-4 py-1 rounded-bl-xl">
              10x Mais Rápido
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FCA311] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#FCA311]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Com o Gera Pauta</h3>
                <p className="text-xs text-[#FCA311]">Pronto para postar e faturar</p>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-white/90">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#FCA311] shrink-0 mt-0.5" />
                <span><strong>Memória de Marca:</strong> Cadastre seu nicho uma única vez e a IA nunca mais esquece seu posicionamento.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#FCA311] shrink-0 mt-0.5" />
                <span><strong>Headline do Canva Pronta:</strong> Duas variações de ganchos visuais para parar o scroll no Instagram.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#FCA311] shrink-0 mt-0.5" />
                <span><strong>Foco em Vendas:</strong> Legendas estrategicamente desenhadas para converter em pedidos ou agendamentos.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#FCA311] shrink-0 mt-0.5" />
                <span><strong>Pauta em 10 Segundos:</strong> O fim do bloqueio criativo e de pagar mensalidades de R$ 1.500 para agências.</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 6. BENTO GRID DE FUNCIONALIDADES (3x2 ASSIMÉTRICO MODERNO) */}
      <section id="recursos" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge className="bg-[#14213D] text-[#FCA311] border-[#FCA311]/40 text-xs py-1 px-3">
            Recursos Premium
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Tudo o que você precisa para dominar o conteúdo do seu negócio
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 (Largo 2 colunas): Memória de Marca */}
          <Card className="md:col-span-2 bg-[#14213D] border border-[rgba(229,229,229,0.12)] p-7 rounded-3xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3 max-w-lg">
              <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FCA311]/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#FCA311]" />
              </div>
              <h3 className="text-xl font-bold text-white">Memória de Marca Inteligente</h3>
              <p className="text-xs sm:text-sm text-[#E5E5E5]/75 leading-relaxed">
                Você define seu nicho, seu tom de voz (acolhedor, autoritário, descontraído) e as principais dores do seu público. A IA utiliza essa memória para nunca criar conteúdos genéricos.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-[#000000]/60 border border-[rgba(229,229,229,0.08)] flex flex-wrap gap-2 text-xs">
              <span className="bg-[#14213D] text-[#FCA311] px-2.5 py-1 rounded-md border border-[#FCA311]/30">✓ Tom de Voz Salvo</span>
              <span className="bg-[#14213D] text-[#FCA311] px-2.5 py-1 rounded-md border border-[#FCA311]/30">✓ Objeções Mapeadas</span>
              <span className="bg-[#14213D] text-[#FCA311] px-2.5 py-1 rounded-md border border-[#FCA311]/30">✓ Diferenciais do Negócio</span>
            </div>
          </Card>

          {/* Card 2: Pronto para o Canva */}
          <Card className="bg-[#14213D] border border-[rgba(229,229,229,0.12)] p-7 rounded-3xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FCA311]/40 flex items-center justify-center">
                <Layers className="w-5 h-5 text-[#FCA311]" />
              </div>
              <h3 className="text-xl font-bold text-white">Pronto para o Canva</h3>
              <p className="text-xs sm:text-sm text-[#E5E5E5]/75 leading-relaxed">
                Chega de quebrar a cabeça para saber o que escrever na imagem de capa. Entregamos duas variações de headline prontas para diagramar.
              </p>
            </div>
            <div className="mt-6 text-xs text-[#FCA311] font-semibold flex items-center gap-1">
              Copie com 1 clique direto no painel ➔
            </div>
          </Card>

          {/* Card 3: Motor Multicanal */}
          <Card className="bg-[#14213D] border border-[rgba(229,229,229,0.12)] p-7 rounded-3xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FCA311]/40 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-[#FCA311]" />
              </div>
              <h3 className="text-xl font-bold text-white">Motor Multicanal</h3>
              <p className="text-xs sm:text-sm text-[#E5E5E5]/75 leading-relaxed">
                Alterne com um clique entre o formato visual do Instagram, o tom ágil do WhatsApp ou a sobriedade do LinkedIn.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#000000] border border-white/10 flex items-center justify-center text-xs">📸</span>
              <span className="w-7 h-7 rounded-lg bg-[#000000] border border-white/10 flex items-center justify-center text-xs">💬</span>
              <span className="w-7 h-7 rounded-lg bg-[#000000] border border-white/10 flex items-center justify-center text-xs">💼</span>
            </div>
          </Card>

          {/* Card 4 (Largo 2 colunas): Arquitetura de Alta Velocidade */}
          <Card className="md:col-span-2 bg-[#14213D] border border-[rgba(229,229,229,0.12)] p-7 rounded-3xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3 max-w-lg">
              <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FCA311]/40 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[#FCA311]" />
              </div>
              <h3 className="text-xl font-bold text-white">Velocidade & Resiliência Instantânea</h3>
              <p className="text-xs sm:text-sm text-[#E5E5E5]/75 leading-relaxed">
                Alimentado por modelos de inteligência de última geração com tempo de resposta inferior a 10 segundos. Sem filas de espera e sem telas travadas.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-4 text-xs font-mono text-emerald-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Tempo médio: 6.4s
              </span>
              <span className="text-[#E5E5E5]/30">|</span>
              <span className="text-white">Suporte a Chave Própria (BYOK) para usuários avançados</span>
            </div>
          </Card>

        </div>
      </section>

      {/* 7. TABELA DE PREÇOS COM SELETOR MENSAL / ANUAL */}
      <section id="precos" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <Badge className="bg-[#14213D] text-[#FCA311] border-[#FCA311]/40 text-xs py-1 px-3">
            Planos & Preços
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Menos que o valor de um único almoço por mês
          </h2>
          <p className="text-sm text-[#E5E5E5]/70">
            Comece de graça e faça o upgrade apenas quando comprovar o aumento de clientes.
          </p>

          {/* Toggle Mensal / Anual */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${billingCycle === "monthly" ? "text-white" : "text-[#E5E5E5]/50"}`}>
              Mensal
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="w-12 h-6 rounded-full bg-[#14213D] border border-[#FCA311]/40 p-1 flex items-center transition-colors cursor-pointer"
            >
              <div className={`w-4 h-4 rounded-full bg-[#FCA311] transition-transform ${billingCycle === "yearly" ? "translate-x-6" : ""}`} />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-white" : "text-[#E5E5E5]/50"}`}>
              Anual <span className="bg-[#FCA311] text-black text-[10px] font-black px-1.5 py-0.5 rounded">Economize 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Plano Gratuito (Degustação) */}
          <Card className="bg-[#0b0c10] border border-[rgba(229,229,229,0.15)] p-8 rounded-3xl flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Degustação Gratuita</h3>
                <p className="text-xs text-[#E5E5E5]/60 mt-1">Para experimentar o valor real no seu negócio</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">R$ 0</span>
                <span className="text-xs text-[#E5E5E5]/60">/ 5 pautas cortesia</span>
              </div>

              <ul className="space-y-3 text-xs text-[#E5E5E5]/80 border-t border-white/10 pt-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>5 pautas completas e estruturadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>2 opções de headline da arte para o Canva</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Legendas completas com chamada para ação</span>
                </li>
                <li className="flex items-center gap-2 text-[#E5E5E5]/40">
                  <Check className="w-4 h-4 text-[#E5E5E5]/30 shrink-0" />
                  <span>Sem necessidade de cadastrar cartão</span>
                </li>
              </ul>
            </div>

            <Link href="/login" className="mt-8">
              <Button
                variant="outline"
                className="w-full border-white/20 bg-transparent text-white hover:bg-white hover:text-black font-bold h-12 rounded-xl cursor-pointer"
              >
                Começar Grátis Agora
              </Button>
            </Link>
          </Card>

          {/* Plano Pro (Destaque Dourado) */}
          <Card className="bg-[#14213D] border-2 border-[#FCA311] p-8 rounded-3xl flex flex-col justify-between relative shadow-2xl shadow-[#FCA311]/20">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FCA311] text-black text-xs font-black uppercase px-4 py-1 rounded-full shadow-lg">
              MAIS ESCOLHIDO
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Plano Pro Ilimitado <Sparkles className="w-4 h-4 text-[#FCA311]" />
                </h3>
                <p className="text-xs text-[#FCA311]/80 mt-1">Para quem quer postar toda semana e vender</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">
                  {billingCycle === "monthly" ? "R$ 47" : "R$ 37"}
                </span>
                <span className="text-xs text-[#E5E5E5]/60">/ mês</span>
              </div>

              <ul className="space-y-3 text-xs text-white/95 border-t border-white/10 pt-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FCA311] shrink-0" />
                  <span><strong>Gerações ilimitadas</strong> de pautas mensais</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FCA311] shrink-0" />
                  <span>Histórico completo salvo na nuvem</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FCA311] shrink-0" />
                  <span>Multi-empresas (ideal para agências e consultores)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FCA311] shrink-0" />
                  <span>Suporte prioritário via WhatsApp</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FCA311] shrink-0" />
                  <span>Cancele quando quiser com 1 clique, sem multas</span>
                </li>
              </ul>
            </div>

            <Link href="/login" className="mt-8">
              <Button
                className="w-full bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-black h-12 rounded-xl shadow-xl shadow-[#FCA311]/30 cursor-pointer text-sm"
              >
                Assinar Plano Pro <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </Card>

        </div>
      </section>

      {/* 8. FAQ SANFONADO (ACCORDION MODERNO) */}
      <section id="faq" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full scroll-mt-20">
        <div className="text-center mb-12 space-y-3">
          <Badge className="bg-[#14213D] text-[#FCA311] border-[#FCA311]/40 text-xs py-1 px-3">
            Tire Suas Dúvidas
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="bg-[#14213D]/70 border border-[rgba(229,229,229,0.12)] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-sm sm:text-base cursor-pointer hover:text-[#FCA311] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#FCA311] shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#E5E5E5]/80 leading-relaxed border-t border-[rgba(229,229,229,0.06)] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. CARD CTA FINAL IMERSIVO */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#14213D] via-[#000000] to-[#14213D] border border-[#FCA311]/40 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#FCA311]/20 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#FCA311]/20 blur-[90px] rounded-full pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-2xl mx-auto leading-tight">
            Pronto para nunca mais travar na hora de criar conteúdo?
          </h2>
          <p className="text-sm sm:text-base text-[#E5E5E5]/80 max-w-xl mx-auto">
            Crie suas primeiras 5 pautas em menos de 2 minutos. Sem cartão de crédito e sem complicação.
          </p>

          <div className="pt-2">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-black text-sm h-14 px-9 rounded-xl shadow-2xl shadow-[#FCA311]/40 cursor-pointer gap-2 hover:scale-105 transition-transform"
              >
                <Zap className="w-4 h-4 fill-black" /> Começar Agora Gratuitamente
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. FOOTER ELEGANTE */}
      <footer className="border-t border-[rgba(229,229,229,0.12)] bg-[#050914] py-10 text-xs text-[#E5E5E5]/60 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#000000] border border-[#FCA311]/40 flex items-center justify-center font-bold text-[#FCA311] text-xs">
              GP
            </div>
            <span className="font-bold text-white text-sm">Gera Pauta</span>
            <span className="text-[#E5E5E5]/40">• Inteligência Editorial para Negócios</span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <Link href="/login" className="hover:text-[#FCA311] transition-colors">Entrar</Link>
            <Link href="/dashboard" className="hover:text-[#FCA311] transition-colors">Painel</Link>
            <a href="#precos" className="hover:text-[#FCA311] transition-colors">Preços</a>
            <a href="#faq" className="hover:text-[#FCA311] transition-colors">FAQ</a>
          </div>

          <p className="text-[11px] text-[#E5E5E5]/40">
            © {new Date().getFullYear()} Gera Pauta. Todos os direitos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
}
