"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Check, 
  Zap, 
  Copy, 
  ChevronDown, 
  Star, 
  Layers, 
  ShieldCheck, 
  Smartphone, 
  Cpu, 
  Share2, 
  MessageCircle, 
  Briefcase, 
  Building2, 
  Clock, 
  TrendingUp, 
  MousePointerClick,
  FileText,
  Palette,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [copiedHeadline, setCopiedHeadline] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHeadline(text);
    toast.success("Copiado com sucesso!");
    setTimeout(() => setCopiedHeadline(null), 2000);
  };

  const faqs = [
    {
      q: "Preciso ter conhecimento de prompts ou inteligência artificial?",
      a: "Não! O Gera Pauta foi construído para o dono de negócio e para o criador de conteúdo. Você não precisa escrever comandos complicados: basta selecionar seu objetivo, nicho e tom de voz. O sistema entrega os 4 blocos prontos em segundos."
    },
    {
      q: "Por que o Gera Pauta é melhor que o ChatGPT gratuito?",
      a: "O ChatGPT é genérico, prolixo e esquece as regras do seu negócio a cada conversa. O Gera Pauta tem memória de marca, entrega 2 opções de headline prontas para diagramar na arte do Canva e legendas calibradas com chamada para ação no WhatsApp."
    },
    {
      q: "O que está incluído no teste grátis?",
      a: "Você ganha 5 pautas completas gratuitas logo após o cadastro, sem precisar cadastrar nenhum cartão de crédito."
    },
    {
      q: "Como funciona a assinatura do Plano Pro?",
      a: "No plano Pro (R$ 47/mês), você tem gerações ilimitadas, pode salvar múltiplos negócios e tem suporte prioritário. O cancelamento é imediato com 1 clique no painel, sem multa ou carência."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050914] text-white font-sans selection:bg-[#FCA311]/30 scroll-smooth flex flex-col">
      
      {/* 1. HEADER LIMPO E ELEGANTE (ESTILO STARTO) */}
      <header className="sticky top-0 z-50 bg-[#050914]/90 backdrop-blur-md border-b border-[rgba(229,229,229,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14213D] to-[#000000] border border-[#FCA311]/50 flex items-center justify-center font-black text-[#FCA311] text-lg shadow-md group-hover:scale-105 transition-transform">
              GP
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-tight">
                Gera Pauta
              </span>
              <span className="text-[10px] text-[#E5E5E5]/60 block uppercase tracking-widest font-semibold">
                Editorial AI
              </span>
            </div>
          </Link>

          {/* Links Centrais (Starto Style) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#E5E5E5]/80">
            <a href="#como-funciona" className="hover:text-[#FCA311] transition-colors">Como Funciona</a>
            <a href="#recursos" className="hover:text-[#FCA311] transition-colors">Recursos</a>
            <a href="#comparativo" className="hover:text-[#FCA311] transition-colors">Diferenciais</a>
            <a href="#precos" className="hover:text-[#FCA311] transition-colors">Planos</a>
            <a href="#faq" className="hover:text-[#FCA311] transition-colors">FAQ</a>
          </nav>

          {/* Ações */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-semibold text-[#E5E5E5] hover:text-[#FCA311] hover:bg-white/5 cursor-pointer"
              >
                Entrar
              </Button>
            </Link>

            <Link href="/login">
              <Button
                size="sm"
                className="bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-extrabold text-sm h-11 px-5 rounded-full shadow-lg shadow-[#FCA311]/20 cursor-pointer transition-all hover:scale-105"
              >
                Testar 5 Pautas Grátis
              </Button>
            </Link>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION COM SPLIT 50/50 & MOCKUP FLUTUANTE (ESTILO STARTO HOME-5) */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* Glow atmosférico suave atrás do Hero */}
        <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#FCA311]/15 to-[#14213D]/40 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Lado Esquerdo: Conteúdo Persuasivo e Chamada */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14213D] border border-[#FCA311]/30 text-[#FCA311] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>A evolução do conteúdo com inteligência artificial</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
              Pautas para redes sociais que <span className="text-[#FCA311]">geram clientes reais</span> para o seu negócio.
            </h1>

            <p className="text-base sm:text-lg text-[#E5E5E5]/75 leading-relaxed">
              O fim do bloqueio criativo e de respostas genéricas do ChatGPT. Em menos de 10 segundos, tenha o <strong>Mote Estratégico</strong>, <strong>2 Opções de Headline para a arte do Canva</strong> e <strong>Legenda com CTA direta para o seu WhatsApp</strong>.
            </p>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-extrabold text-sm h-13 px-8 rounded-full shadow-xl shadow-[#FCA311]/25 cursor-pointer gap-2 transition-all hover:scale-105"
                >
                  Criar Minhas 5 Pautas Gratuitas <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <a href="#como-funciona" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white/20 bg-[#14213D]/60 text-white hover:bg-white/10 hover:text-[#FCA311] text-sm h-13 px-6 rounded-full cursor-pointer"
                >
                  Como Funciona
                </Button>
              </a>
            </div>

            {/* 3 Bullets de Confiança no estilo Starto */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#E5E5E5]/80 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Sem cartão de crédito
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FCA311]" /> 5 pautas cortesia
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" /> Cancele quando quiser
              </span>
            </div>

          </div>

          {/* Lado Direito: Device Mockup Elegante (Dashboard + Mobile Preview - Starto Style) */}
          <div className="lg:col-span-6 relative">
            
            {/* Desktop Dashboard Window */}
            <div className="relative rounded-2xl bg-[#14213D] border border-[rgba(229,229,229,0.15)] shadow-2xl overflow-hidden">
              
              {/* Window Header */}
              <div className="bg-[#0b1324] px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-[#E5E5E5]/60">app.gerapauta.com</span>
                </div>
                <Badge className="bg-[#FCA311]/20 text-[#FCA311] border-[#FCA311]/40 text-[10px]">
                  Odontologia & Estética
                </Badge>
              </div>

              {/* Window Content */}
              <div className="p-5 space-y-4 text-left">
                
                {/* Mote */}
                <div className="p-3 rounded-xl bg-[#050914] border border-white/5">
                  <span className="text-[10px] font-bold text-[#FCA311] uppercase tracking-wider block mb-1">
                    1. Mote Estratégico
                  </span>
                  <p className="text-xs text-[#E5E5E5]/90">
                    Desmistificar o medo de sensibilidade em clareamentos dentais e levar o paciente ao agendamento no WhatsApp.
                  </p>
                </div>

                {/* 2 Headlines de Arte */}
                <div className="p-3 rounded-xl bg-[#050914] border border-white/5 space-y-2">
                  <span className="text-[10px] font-bold text-[#FCA311] uppercase tracking-wider block">
                    2. Headlines para a Arte do Canva
                  </span>
                  
                  <div className="p-2 rounded bg-white/5 border border-white/10 text-xs flex items-center justify-between">
                    <span><strong>Opção A:</strong> "O que nunca te contaram sobre o clareamento moderno sem dor."</span>
                    <Copy className="w-3.5 h-3.5 text-[#FCA311] shrink-0" />
                  </div>
                  
                  <div className="p-2 rounded bg-white/5 border border-white/10 text-xs flex items-center justify-between">
                    <span><strong>Opção B:</strong> "Ainda com medo da sensibilidade? A odontologia evoluiu."</span>
                    <Copy className="w-3.5 h-3.5 text-[#FCA311] shrink-0" />
                  </div>
                </div>

                {/* Legenda com CTA */}
                <div className="p-3 rounded-xl bg-[#050914] border border-white/5">
                  <span className="text-[10px] font-bold text-[#FCA311] uppercase tracking-wider block mb-1">
                    3. Legenda Pronta com CTA
                  </span>
                  <p className="text-xs text-[#E5E5E5]/80 line-clamp-2">
                    A verdade é que os novos protocolos protegem o esmalte em sessão única. Toque no link da bio e envie 'CLAREAMENTO' no WhatsApp da clínica...
                  </p>
                </div>

              </div>

            </div>

            {/* Mobile Card Floating Overlap (Estilo Starto Home-5) */}
            <div className="hidden sm:block absolute -bottom-8 -left-6 w-64 bg-[#000000] border-2 border-[#FCA311]/60 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-fade-in">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                <span className="text-lg">💬</span>
                <div>
                  <p className="text-[11px] font-bold text-white leading-none">WhatsApp Comercial</p>
                  <span className="text-[9px] text-emerald-400 font-medium">Novo cliente interessado</span>
                </div>
              </div>
              <p className="text-[11px] text-[#E5E5E5]/90 bg-[#14213D] p-2 rounded-lg leading-snug">
                "Olá! Vi o post de vocês sobre o clareamento sem dor. Gostaria de agendar uma avaliação!"
              </p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-[#FCA311] font-semibold">
                <span>Conversão direta</span>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* 3. LOGO / MARQUEE DE MERCADOS (ESTILO STARTO) */}
      <section className="py-10 border-y border-[rgba(229,229,229,0.08)] bg-[#0b1324]/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#E5E5E5]/60 mb-6">
            Inteligência contextual calibrada para quem precisa vender:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-medium text-white/90">
            {[
              "Clínicas Odontológicas & Médicas",
              "Hamburguerias & Gastronomia",
              "Escritórios de Advocacia",
              "Studios de Pilates & Crossfit",
              "Estética & Beleza",
              "Contabilidade & BPO",
              "Imobiliárias & Corretores",
              "Agências & Social Media"
            ].map((niche, idx) => (
              <span key={idx} className="px-4 py-2 rounded-full bg-[#14213D] border border-white/10 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FCA311]" />
                {niche}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (SEQUÊNCIA EM 4 PASSOS - ESTILO SOLIT) */}
      <section id="como-funciona" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full text-center scroll-mt-20">
        
        <div className="max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#FCA311] uppercase tracking-widest">
            Fluxo Simples & Descomplicado
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Como o Gera Pauta funciona na prática
          </h2>
          <p className="text-sm text-[#E5E5E5]/70">
            Em apenas 4 passos você sai do zero e tem um mês de conteúdo estratégico pronto para publicar.
          </p>
        </div>

        {/* 4 Step Cards (Linear Horizontal Flow) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          
          {[
            {
              step: "01",
              title: "Memória da Marca",
              desc: "Cadastre seu nicho, seu tom de voz e os principais diferenciais do seu negócio uma única vez.",
              icon: Building2
            },
            {
              step: "02",
              title: "IA Contextualiza",
              desc: "Nossa inteligência cria o Mote Estratégico focado nas dores reais do seu cliente, sem enrolação.",
              icon: Sparkles
            },
            {
              step: "03",
              title: "Headline da Arte",
              desc: "Receba 2 opções de títulos curtos e de alto impacto para colocar na capa do post no Canva.",
              icon: Palette
            },
            {
              step: "04",
              title: "Legenda & WhatsApp",
              desc: "Copie a copy completa pronta com gancho e chamada para ação no WhatsApp comercial da sua empresa.",
              icon: Send
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-[#14213D] border border-[rgba(229,229,229,0.12)] p-6 rounded-2xl relative overflow-hidden group hover:border-[#FCA311]/50 transition-all hover:-translate-y-1"
              >
                <div className="text-3xl font-black text-[#FCA311]/25 group-hover:text-[#FCA311] transition-colors mb-4 font-mono">
                  {item.step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#050914] border border-white/10 flex items-center justify-center text-[#FCA311] mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-[#E5E5E5]/70 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}

        </div>

      </section>

      {/* 5. ZIG-ZAG FEATURE SPOTLIGHTS (ESTILO STARTO & SOLIT 50/50 SPLIT) */}
      <section id="comparativo" className="py-20 bg-[#000000] border-t border-[rgba(229,229,229,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-24">
          
          {/* Spotlight 1: Foco na Arte do Canva */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Texto */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <span className="text-xs font-bold text-[#FCA311] uppercase tracking-wider">
                Pronto para o Designer ou Canva
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Nunca mais fique olhando para a tela em branco sem saber o que escrever na arte.
              </h2>
              <p className="text-sm text-[#E5E5E5]/75 leading-relaxed">
                A maioria das pessoas falha no Instagram porque a imagem do post não chama a atenção. O Gera Pauta entrega as <strong>Headlines exatas</strong> que devem ir em destaque na arte para interromper o scroll.
              </p>
              
              <ul className="space-y-3 text-xs sm:text-sm text-[#E5E5E5]/90 pt-2">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FCA311] shrink-0" />
                  <span>2 opções de headlines curtas e testadas por pauta</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FCA311] shrink-0" />
                  <span>Ganchos calibrados para carrossel, Reels ou post estático</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FCA311] shrink-0" />
                  <span>Copie com 1 clique e cole direto na sua caixa de texto do Canva</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link href="/login">
                  <Button className="bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-bold text-xs h-11 px-6 rounded-full cursor-pointer">
                    Experimentar Agora
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card Visual Canva Preview */}
            <div className="lg:col-span-6">
              <div className="bg-[#14213D] border border-white/10 rounded-2xl p-6 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <span className="text-xs font-mono text-[#FCA311] font-bold">Simulação de Lâmina de Carrossel</span>
                  <Badge className="bg-[#050914] text-white text-[10px]">Instagram Feed</Badge>
                </div>

                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[#0b1324] to-[#000000] border border-[#FCA311]/30 p-8 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-xs font-mono text-[#FCA311]">
                    <span>01/03</span>
                    <span>Arraste para o lado ➔</span>
                  </div>

                  <div className="space-y-3">
                    <span className="inline-block bg-[#FCA311] text-black text-[10px] font-black uppercase px-2.5 py-1 rounded">
                      Headline da Capa
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                      "O que nunca te contaram sobre o clareamento moderno sem dor."
                    </h3>
                  </div>

                  <div className="text-[11px] text-[#E5E5E5]/60 flex justify-between items-center border-t border-white/10 pt-3">
                    <span>Sua Marca Aqui</span>
                    <span>Salvar post 🔖</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Spotlight 2 (Reverso): Foco em Vendas & WhatsApp */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Mockup WhatsApp */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="bg-[#14213D] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-lg">
                    💬
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Funil de Conversão Local</h4>
                    <p className="text-[11px] text-emerald-400">Do Instagram direto para a conversa</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-[#050914] p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-[#FCA311] uppercase">CTA da Legenda:</span>
                    <p className="text-[#E5E5E5]">"Toque no link da bio e envie a palavra 'CLAREAMENTO' no WhatsApp para receber o protocolo exclusivo."</p>
                  </div>

                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Resultado no WhatsApp Comercial:</span>
                    <p className="text-white font-medium">"Olá! Vi o post no Instagram e quero agendar meu clareamento com a equipe."</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Texto */}
            <div className="lg:col-span-6 space-y-5 text-left order-1 lg:order-2">
              <span className="text-xs font-bold text-[#FCA311] uppercase tracking-wider">
                Foco em Faturamento Real
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Likes não pagam as contas. Pautas feitas para gerar mensagens e vendas.
              </h2>
              <p className="text-sm text-[#E5E5E5]/75 leading-relaxed">
                Ao contrário do ChatGPT que costuma sugerir chamadas genéricas como <em>"deixe seu like e compartilhe com os amigos"</em>, o Gera Pauta desenha a legenda para direcionar o cliente potencial para o seu canal de vendas mais rápido.
              </p>
              
              <ul className="space-y-3 text-xs sm:text-sm text-[#E5E5E5]/90 pt-2">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FCA311] shrink-0" />
                  <span>Chamadas para ação calibradas para WhatsApp e direct</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FCA311] shrink-0" />
                  <span>Quebra antecipada de objeções de preço e tempo</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FCA311] shrink-0" />
                  <span>Linguagem humanizada e acolhedora</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 6. FEATURES GRID (CARDS LIMPOS 3x2 - ESTILO SOLIT & STARTO) */}
      <section id="recursos" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full text-center scroll-mt-20">
        
        <div className="max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#FCA311] uppercase tracking-widest">
            Recursos Essenciais
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Tudo o que você precisa em uma única plataforma
          </h2>
          <p className="text-sm text-[#E5E5E5]/70">
            Criado especificamente para pequenas empresas, consultórios e agências locais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          
          {[
            {
              title: "Memória de Marca Permanente",
              desc: "Cadastre as personas e objeções uma vez. A IA nunca mais esquece quem é você ou o que sua empresa faz.",
              icon: ShieldCheck
            },
            {
              title: "Headline da Arte Pronta",
              desc: "O gancho visual exato que vai diagramado na imagem do post para parar o scroll no feed.",
              icon: Layers
            },
            {
              title: "Suporte Multicanal",
              desc: "Adapte o conteúdo para a agilidade do Instagram, o foco do WhatsApp ou a sobriedade do LinkedIn.",
              icon: Smartphone
            },
            {
              title: "Geração em Menos de 8s",
              desc: "Arquitetura otimizada para respostas instantâneas, sem telas travadas ou demoras desnecessárias.",
              icon: Zap
            },
            {
              title: "Histórico Seguro na Nuvem",
              desc: "Todas as suas pautas salvas automaticamente com pesquisa e botão de cópia rápida.",
              icon: Clock
            },
            {
              title: "Chave Própria (BYOK) Opcional",
              desc: "Usuários avançados podem conectar sua própria chave Gemini do Google AI Studio gratuitamente.",
              icon: Cpu
            }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="bg-[#14213D] border border-[rgba(229,229,229,0.1)] p-7 rounded-2xl hover:border-[#FCA311]/40 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[#050914] border border-white/10 flex items-center justify-center text-[#FCA311] mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-[#E5E5E5]/70 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}

        </div>

      </section>

      {/* 7. PREÇOS (CARDS LIMPOS COM DESTAQUE DOURADO) */}
      <section id="precos" className="py-24 bg-[#000000] border-t border-[rgba(229,229,229,0.08)] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-[#FCA311] uppercase tracking-widest">
              Planos Transparentes
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Investimento simples que se paga no primeiro cliente
            </h2>
            <p className="text-sm text-[#E5E5E5]/70">
              Comece sem custos com as 5 pautas cortesia e assine quando comprovar os resultados.
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left items-stretch">
            
            {/* Plano Grátis */}
            <div className="bg-[#14213D]/60 border border-white/10 p-8 rounded-3xl flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Degustação Gratuita</h3>
                  <p className="text-xs text-[#E5E5E5]/60 mt-1">Para experimentar a qualidade no seu negócio</p>
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
                    <span>Legendas com chamada para ação no WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#E5E5E5]/50">
                    <Check className="w-4 h-4 text-[#E5E5E5]/30 shrink-0" />
                    <span>Não pede dados de cartão de crédito</span>
                  </li>
                </ul>
              </div>

              <Link href="/login" className="mt-8">
                <Button
                  variant="outline"
                  className="w-full border-white/20 bg-transparent text-white hover:bg-white hover:text-black font-bold h-12 rounded-full cursor-pointer text-sm"
                >
                  Começar Gratuitamente
                </Button>
              </Link>
            </div>

            {/* Plano Pro */}
            <div className="bg-[#14213D] border-2 border-[#FCA311] p-8 rounded-3xl flex flex-col justify-between relative shadow-2xl shadow-[#FCA311]/15">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FCA311] text-black text-xs font-black uppercase px-4 py-1 rounded-full shadow-md">
                Mais Escolhido
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Plano Pro Ilimitado <Sparkles className="w-4 h-4 text-[#FCA311]" />
                  </h3>
                  <p className="text-xs text-[#FCA311]/80 mt-1">Para quem posta toda semana e busca clientes</p>
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
                    <span>Multi-empresas para atender diferentes clientes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FCA311] shrink-0" />
                    <span>Suporte prioritário via WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FCA311] shrink-0" />
                    <span>Sem carência: cancele a qualquer momento com 1 clique</span>
                  </li>
                </ul>
              </div>

              <Link href="/login" className="mt-8">
                <Button
                  className="w-full bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-extrabold h-12 rounded-full shadow-xl shadow-[#FCA311]/30 cursor-pointer text-sm"
                >
                  Assinar Plano Pro <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 8. FAQ ACCORDION (ESTILO SOLIT) */}
      <section id="faq" className="py-24 px-4 sm:px-6 max-w-4xl mx-auto w-full scroll-mt-20 text-center">
        
        <div className="mb-14 space-y-3">
          <span className="text-xs font-bold text-[#FCA311] uppercase tracking-widest">
            Perguntas Frequentes
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Tire todas as suas dúvidas
          </h2>
        </div>

        <div className="space-y-4 text-left">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="bg-[#14213D] border border-white/10 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-sm sm:text-base cursor-pointer hover:text-[#FCA311] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#FCA311] shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#E5E5E5]/80 leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* 9. BOTTOM CTA BANNER CURVO (ESTILO SOLIT) */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-[#14213D] via-[#0b1324] to-[#14213D] border border-[#FCA311]/40 shadow-2xl text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-2xl mx-auto leading-tight">
            Pronto para nunca mais travar na hora de criar conteúdo?
          </h2>
          <p className="text-sm sm:text-base text-[#E5E5E5]/80 max-w-xl mx-auto leading-relaxed">
            Cadastre-se agora e crie suas primeiras 5 pautas em menos de 2 minutos. Sem cartão de crédito.
          </p>

          <div className="pt-2">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-extrabold text-sm h-14 px-10 rounded-full shadow-2xl shadow-[#FCA311]/40 cursor-pointer gap-2 hover:scale-105 transition-transform"
              >
                <Zap className="w-4 h-4 fill-black" /> Criar 5 Pautas Gratuitas Agora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. FOOTER LIMPO EM COLUNAS (ESTILO STARTO) */}
      <footer className="border-t border-white/10 bg-[#050914] py-12 text-xs text-[#E5E5E5]/60 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#14213D] border border-[#FCA311]/40 flex items-center justify-center font-bold text-[#FCA311] text-xs">
              GP
            </div>
            <div>
              <span className="font-bold text-white text-sm block">Gera Pauta</span>
              <span className="text-[#E5E5E5]/40 text-[10px]">Inteligência Editorial para Pequenos Negócios</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <Link href="/login" className="hover:text-[#FCA311] transition-colors">Entrar</Link>
            <Link href="/dashboard" className="hover:text-[#FCA311] transition-colors">Painel</Link>
            <a href="#como-funciona" className="hover:text-[#FCA311] transition-colors">Como Funciona</a>
            <a href="#precos" className="hover:text-[#FCA311] transition-colors">Preços</a>
            <a href="#faq" className="hover:text-[#FCA311] transition-colors">FAQ</a>
          </div>

          <p className="text-[11px] text-[#E5E5E5]/40">
            © 2026 Gera Pauta. Todos os direitos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
}
