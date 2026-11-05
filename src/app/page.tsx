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
  Layers, 
  ShieldCheck, 
  Smartphone, 
  Cpu, 
  Building2, 
  Clock, 
  Palette,
  Send,
  Star
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
      a: "Não! O Gera Pauta foi desenhado especificamente para quem não é da área técnica. Você não precisa inventar comandos complicados: basta selecionar seu nicho, seu objetivo e o sistema entrega os 4 blocos prontos para publicação."
    },
    {
      q: "Por que o Gera Pauta é melhor que o ChatGPT gratuito?",
      a: "O ChatGPT é genérico, prolixo e esquece as regras do seu negócio a cada conversa. O Gera Pauta tem memória de marca permanente, entrega 2 opções de headline prontas para diagramar na arte do Canva e legendas calibradas com chamada para ação no WhatsApp."
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
    <div className="min-h-screen bg-[#FFFFFF] text-[#0F172A] font-sans selection:bg-[#FCA311]/30 scroll-smooth flex flex-col">
      
      {/* ========================================================
          SEÇÃO 1: HEADER & HERO COM A COR DA MARCA (#14213D Prussian Blue & Ouro)
      ======================================================== */}
      <div className="bg-gradient-to-b from-[#14213D] via-[#0E172B] to-[#14213D] text-white border-b border-white/10 relative overflow-hidden">
        
        {/* Glows de luz atmosférica de fundo */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-[#FCA311]/15 blur-[150px] rounded-full pointer-events-none -z-0" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#FCA311]/10 blur-[140px] rounded-full pointer-events-none -z-0" />

        {/* Header Elegante com Glassmorphism Translúcido */}
        <header className="sticky top-0 z-50 bg-[#14213D]/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FCA311] flex items-center justify-center font-black text-[#FCA311] text-lg shadow-md group-hover:scale-105 transition-transform">
                GP
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white block leading-tight">
                  Gera Pauta
                </span>
                <span className="text-[10px] text-[#FCA311] block uppercase tracking-widest font-bold">
                  Editorial AI
                </span>
              </div>
            </Link>

            {/* Links Centrais */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-200">
              <a href="#como-funciona" className="hover:text-[#FCA311] transition-colors">Como Funciona</a>
              <a href="#diferenciais" className="hover:text-[#FCA311] transition-colors">Diferenciais</a>
              <a href="#recursos" className="hover:text-[#FCA311] transition-colors">Recursos</a>
              <a href="#precos" className="hover:text-[#FCA311] transition-colors">Planos</a>
              <a href="#faq" className="hover:text-[#FCA311] transition-colors">FAQ</a>
            </nav>

            {/* Ações */}
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  Entrar
                </Button>
              </Link>

              <Link href="/login">
                <Button
                  size="sm"
                  className="bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-extrabold text-sm h-11 px-6 rounded-full shadow-lg shadow-[#FCA311]/25 cursor-pointer transition-all hover:scale-105"
                >
                  Testar 5 Pautas Grátis
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Content 50/50 Imersivo na Cor */}
        <section className="relative z-10 pt-16 pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Esquerda: Texto */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-[#FCA311]/40 text-[#FCA311] text-xs font-bold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#FCA311]" />
                <span>A evolução do conteúdo com inteligência artificial</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                Pautas para redes sociais que <span className="text-[#FCA311] underline decoration-[#FCA311]/50 underline-offset-8">geram clientes reais</span> para o seu negócio.
              </h1>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                O fim do bloqueio criativo e de respostas genéricas do ChatGPT. Em menos de 10 segundos, tenha o <strong>Mote Estratégico</strong>, <strong>2 Opções de Headline para a arte do Canva</strong> e <strong>Legenda com chamada direta para o WhatsApp</strong>.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-black text-sm h-14 px-8 rounded-full shadow-xl shadow-[#FCA311]/30 cursor-pointer gap-2 transition-all hover:scale-105"
                  >
                    Criar Minhas 5 Pautas Gratuitas <ArrowRight className="w-4 h-4 text-black" />
                  </Button>
                </Link>

                <a href="#como-funciona" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white/30 bg-black/30 text-white hover:bg-white/10 hover:text-[#FCA311] text-sm h-14 px-7 rounded-full cursor-pointer"
                  >
                    Como Funciona
                  </Button>
                </a>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Sem cartão de crédito
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#FCA311]" /> 5 pautas cortesia
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-blue-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> Cancele quando quiser
                </span>
              </div>
            </div>

            {/* Direita: Mockup do Software com Contraste */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl bg-white border border-white/20 shadow-2xl shadow-black/60 overflow-hidden text-slate-800">
                <div className="bg-[#000000] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-xs font-mono text-slate-400">app.gerapauta.com</span>
                  </div>
                  <Badge className="bg-[#FCA311] text-black font-bold text-[10px] border-none">
                    Odontologia & Estética
                  </Badge>
                </div>

                <div className="p-6 space-y-4 text-left bg-slate-50">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-bold text-[#14213D] uppercase tracking-wider block mb-1">
                      1. Mote Estratégico
                    </span>
                    <p className="text-xs text-slate-700 font-medium">
                      Desmistificar o medo de sensibilidade em clareamentos dentais e conduzir o paciente ao agendamento no WhatsApp.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <span className="text-[10px] font-bold text-[#14213D] uppercase tracking-wider block">
                      2. Headlines para a Arte do Canva
                    </span>
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-slate-800 flex items-center justify-between">
                      <span><strong className="text-amber-800">Opção A:</strong> "O que nunca te contaram sobre o clareamento moderno sem dor."</span>
                      <Copy className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-800 flex items-center justify-between">
                      <span><strong className="text-slate-900">Opção B:</strong> "Ainda com medo da sensibilidade? A odontologia evoluiu."</span>
                      <Copy className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-bold text-[#14213D] uppercase tracking-wider block mb-1">
                      3. Legenda Pronta com CTA
                    </span>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      A verdade é que os novos protocolos protegem o esmalte em sessão única. Toque no link da bio e envie 'CLAREAMENTO' no WhatsApp da clínica...
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating WhatsApp Card */}
              <div className="hidden sm:block absolute -bottom-8 -left-6 w-68 bg-white border-2 border-[#FCA311] rounded-2xl p-4 shadow-2xl shadow-black/50 text-slate-800">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                  <span className="text-lg">💬</span>
                  <div>
                    <p className="text-[11px] font-bold text-[#14213D] leading-none">WhatsApp Comercial</p>
                    <span className="text-[9px] text-emerald-600 font-bold">Novo cliente interessado</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-700 bg-slate-50 border border-slate-100 p-2.5 rounded-lg leading-snug">
                  "Olá! Vi o post de vocês sobre o clareamento sem dor. Gostaria de agendar uma avaliação!"
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-amber-700 font-bold">
                  <span>Conversão direta</span>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* ========================================================
          SEÇÃO 2: COMO FUNCIONA (☀️ BRANCO / CLEAN)
      ======================================================== */}
      <section id="como-funciona" className="py-24 bg-[#FFFFFF] text-[#0F172A] border-b border-slate-200 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Header da seção */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-[#FCA311] uppercase tracking-widest">
              Fluxo Simples & Descomplicado
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#14213D] tracking-tight">
              Como o Gera Pauta funciona na prática
            </h2>
            <p className="text-sm text-slate-600">
              Em apenas 4 passos você sai do zero e tem um mês de conteúdo estratégico pronto para publicar.
            </p>
          </div>

          {/* 4 Cards Brancos com Destaque Dourado */}
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
                desc: "Nossa inteligência cria o Mote Estratégico focado nas dores reais do seu cliente, sem clichês.",
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
                  className="bg-slate-50 border border-slate-200 p-6 rounded-2xl relative overflow-hidden group hover:border-[#14213D] hover:shadow-xl transition-all hover:-translate-y-1 shadow-sm"
                >
                  <div className="text-4xl font-black text-slate-200 group-hover:text-[#FCA311] transition-colors mb-4 font-mono">
                    {item.step}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#14213D] mb-4 shadow-sm">
                    <Icon className="w-5 h-5 text-[#14213D]" />
                  </div>
                  <h3 className="text-base font-bold text-[#14213D] mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Faixa de Mercados / Logos em Pílulas */}
          <div className="mt-16 pt-12 border-t border-slate-200 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
              Inteligência editorial adaptada para dezenas de mercados locais:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-700">
              {[
                "Clínicas Odontológicas",
                "Hamburguerias & Gastronomia",
                "Escritórios de Advocacia",
                "Studios de Pilates & Crossfit",
                "Estética Avançada",
                "Contabilidade & BPO",
                "Imobiliárias & Corretores",
                "Agências & Social Media"
              ].map((niche, idx) => (
                <span key={idx} className="px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FCA311]" />
                  {niche}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          SEÇÃO 3: SPOTLIGHT DA ARTE DO CANVA (🌑 PRETO / DARK)
      ======================================================== */}
      <section id="diferenciais" className="py-24 bg-[#050914] text-white border-b border-slate-800 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Texto à Esquerda */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <span className="text-xs font-bold text-[#FCA311] uppercase tracking-wider">
                Pronto para o Designer ou Canva
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Nunca mais fique olhando para a tela em branco sem saber o que escrever na arte.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                A maioria das pessoas falha nas redes sociais porque a imagem do post não chama a atenção. O Gera Pauta entrega as <strong>Headlines exatas</strong> que devem ir em destaque na arte para interromper o scroll.
              </p>
              
              <ul className="space-y-3 text-xs sm:text-sm text-slate-200 pt-2 font-medium">
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
                  <Button className="bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-bold text-xs h-11 px-6 rounded-full cursor-pointer shadow-md">
                    Experimentar Agora
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card Visual Canva Preview à Direita */}
            <div className="lg:col-span-6">
              <div className="bg-[#14213D] border border-slate-700 rounded-2xl p-6 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-5">
                  <span className="text-xs font-mono text-[#FCA311] font-bold">Simulação de Lâmina de Carrossel</span>
                  <Badge className="bg-[#050914] text-white text-[10px] border border-slate-700">Instagram Feed</Badge>
                </div>

                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[#0b1324] to-[#000000] text-white p-8 flex flex-col justify-between border border-[#FCA311]/30">
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

                  <div className="text-[11px] text-slate-400 flex justify-between items-center border-t border-white/10 pt-3">
                    <span>Sua Marca Aqui</span>
                    <span className="text-[#FCA311]">Salvar post 🔖</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          SEÇÃO 4: SPOTLIGHT DE VENDAS & WHATSAPP (☀️ BRANCO / CLEAN)
      ======================================================== */}
      <section className="py-24 bg-[#FFFFFF] text-[#0F172A] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Mockup WhatsApp à Esquerda */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-lg">
                    💬
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#14213D]">Funil de Conversão Local</h4>
                    <p className="text-[11px] text-emerald-600 font-semibold">Do Instagram direto para a conversa</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1 shadow-sm">
                    <span className="text-[10px] font-bold text-[#14213D] uppercase">CTA da Legenda:</span>
                    <p className="text-slate-700">"Toque no link da bio e envie a palavra 'CLAREAMENTO' no WhatsApp para receber o protocolo exclusivo."</p>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">Resultado no WhatsApp Comercial:</span>
                    <p className="text-slate-900 font-semibold">"Olá! Vi o post no Instagram e quero agendar meu clareamento com a equipe."</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Texto à Direita */}
            <div className="lg:col-span-6 space-y-5 text-left order-1 lg:order-2">
              <span className="text-xs font-bold text-[#FCA311] uppercase tracking-wider">
                Foco em Faturamento Real
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#14213D] leading-tight">
                Likes não pagam as contas. Pautas feitas para gerar mensagens e vendas.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ao contrário do ChatGPT que costuma sugerir chamadas genéricas como <em>"deixe seu like e compartilhe com os amigos"</em>, o Gera Pauta desenha a legenda para direcionar o cliente potencial para o seu canal de vendas mais rápido.
              </p>
              
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 pt-2 font-medium">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Chamadas para ação calibradas para WhatsApp e direct</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Quebra antecipada de objeções de preço e tempo</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Linguagem humanizada e acolhedora</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          SEÇÃO 5: RECURSOS ESSENCIAIS (🌑 PRETO / DARK)
      ======================================================== */}
      <section id="recursos" className="py-24 bg-[#000000] text-white border-b border-slate-800 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-[#FCA311] uppercase tracking-widest">
              Recursos Essenciais
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Tudo o que você precisa em uma única plataforma
            </h2>
            <p className="text-sm text-slate-400">
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
                  className="bg-[#14213D] border border-slate-700/60 p-7 rounded-2xl hover:border-[#FCA311] hover:shadow-xl transition-all hover:-translate-y-1 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#050914] border border-slate-700 flex items-center justify-center text-[#FCA311] mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================
          SEÇÃO 6: PREÇOS & PLANOS (☀️ BRANCO / CLEAN)
      ======================================================== */}
      <section id="precos" className="py-24 bg-[#FFFFFF] text-[#0F172A] border-b border-slate-200 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-[#FCA311] uppercase tracking-widest">
              Planos Transparentes
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#14213D] tracking-tight">
              Investimento simples que se paga no primeiro cliente
            </h2>
            <p className="text-sm text-slate-600">
              Comece sem custos com as 5 pautas cortesia e assine quando comprovar os resultados.
            </p>

            {/* Toggle Mensal / Anual */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <span className={`text-xs font-bold ${billingCycle === "monthly" ? "text-[#14213D]" : "text-slate-400"}`}>
                Mensal
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                className="w-12 h-6 rounded-full bg-slate-300 border border-slate-400 p-1 flex items-center transition-colors cursor-pointer"
              >
                <div className={`w-4 h-4 rounded-full bg-[#14213D] transition-transform ${billingCycle === "yearly" ? "translate-x-6" : ""}`} />
              </button>
              <span className={`text-xs font-bold flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-[#14213D]" : "text-slate-400"}`}>
                Anual <span className="bg-[#FCA311] text-black text-[10px] font-black px-1.5 py-0.5 rounded">Economize 20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left items-stretch">
            
            {/* Plano Grátis */}
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl flex flex-col justify-between shadow-sm">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#14213D]">Degustação Gratuita</h3>
                  <p className="text-xs text-slate-500 mt-1">Para experimentar a qualidade no seu negócio</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#14213D]">R$ 0</span>
                  <span className="text-xs text-slate-500">/ 5 pautas cortesia</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-700 border-t border-slate-200 pt-6 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>5 pautas completas e estruturadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>2 opções de headline da arte para o Canva</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Legendas com chamada para ação no WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <Check className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Não pede dados de cartão de crédito</span>
                  </li>
                </ul>
              </div>

              <Link href="/login" className="mt-8">
                <Button
                  variant="outline"
                  className="w-full border-slate-300 bg-white text-slate-800 hover:bg-slate-100 font-bold h-12 rounded-full cursor-pointer text-sm"
                >
                  Começar Gratuitamente
                </Button>
              </Link>
            </div>

            {/* Plano Pro */}
            <div className="bg-[#14213D] border-2 border-[#FCA311] p-8 rounded-3xl flex flex-col justify-between relative shadow-2xl text-white">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FCA311] text-black text-xs font-black uppercase px-4 py-1 rounded-full shadow-md">
                Mais Escolhido
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Plano Pro Ilimitado <Sparkles className="w-4 h-4 text-[#FCA311]" />
                  </h3>
                  <p className="text-xs text-[#FCA311] mt-1">Para quem posta toda semana e busca clientes</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === "monthly" ? "R$ 47" : "R$ 37"}
                  </span>
                  <span className="text-xs text-slate-400">/ mês</span>
                </div>

                <ul className="space-y-3 text-xs text-white/95 border-t border-slate-700 pt-6 font-medium">
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

      {/* ========================================================
          SEÇÃO 7: FAQ SANFONADO (🌑 PRETO / DARK PROFUNDO)
      ======================================================== */}
      <section id="faq" className="py-24 px-4 sm:px-6 max-w-4xl mx-auto w-full scroll-mt-16 text-center bg-[#050914] text-white rounded-3xl my-8">
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
                className="bg-[#14213D] border border-slate-700/80 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-sm sm:text-base cursor-pointer hover:text-[#FCA311] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#FCA311] shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-700 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          SEÇÃO 8: BOTTOM CTA BANNER & FOOTER (🌌 COM A COR / FECHAMENTO)
      ======================================================== */}
      <div className="bg-[#050914] text-white">
        <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
          <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-[#14213D] via-[#0E172B] to-[#14213D] border border-[#FCA311]/40 shadow-2xl text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-2xl mx-auto leading-tight">
              Pronto para nunca mais travar na hora de criar conteúdo?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
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

        {/* Footer */}
        <footer className="border-t border-slate-800 py-12 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#000000] border border-[#FCA311] flex items-center justify-center font-bold text-[#FCA311] text-xs">
                GP
              </div>
              <div>
                <span className="font-bold text-white text-sm block">Gera Pauta</span>
                <span className="text-slate-500 text-[10px]">Inteligência Editorial para Pequenos Negócios</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs font-semibold">
              <Link href="/login" className="hover:text-[#FCA311] transition-colors">Entrar</Link>
              <Link href="/dashboard" className="hover:text-[#FCA311] transition-colors">Painel</Link>
              <a href="#como-funciona" className="hover:text-[#FCA311] transition-colors">Como Funciona</a>
              <a href="#precos" className="hover:text-[#FCA311] transition-colors">Preços</a>
              <a href="#faq" className="hover:text-[#FCA311] transition-colors">FAQ</a>
            </div>

            <p className="text-[11px] text-slate-500">
              © 2026 Gera Pauta. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>

    </div>
  );
}
