"use client";

import React from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Copy, 
  MessageCircle,
  TrendingUp,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-[#FCA311]/30">
      {/* HEADER PÚBLICO FIXO */}
      <header className="border-b border-[#E5E5E5]/15 bg-[#14213D]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Logo e Nome do Produto */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#000000] border border-[#FCA311]/40 flex items-center justify-center font-black text-[#FCA311] text-base shadow-lg">
              GP
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white block leading-tight">
                Gera Pauta
              </span>
              <span className="text-[10px] text-[#E5E5E5]/70">
                Pequenos Negócios & Agências
              </span>
            </div>
          </Link>

          {/* Links e Ações */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-[#E5E5E5] hover:text-[#FCA311] hover:bg-[#000000]/40 font-semibold cursor-pointer"
              >
                Entrar
              </Button>
            </Link>

            <Link href="/login">
              <Button
                size="sm"
                className="bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-extrabold text-xs h-9 px-4 rounded-xl shadow-lg shadow-[#FCA311]/20 cursor-pointer gap-1.5"
              >
                Testar 5 Pautas Grátis <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION DE ALTO IMPACTO */}
      <section className="relative px-4 sm:px-6 pt-16 pb-20 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Glow de fundo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FCA311]/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Badge de Destaque */}
        <Badge className="bg-[#14213D] text-[#FCA311] border border-[#FCA311]/40 text-xs py-1 px-3 mb-6 font-semibold flex items-center gap-1.5 shadow-lg">
          <Sparkles className="w-3.5 h-3.5" /> O fim das ideias genéricas do ChatGPT
        </Badge>

        {/* Título Principal */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl leading-[1.15]">
          Pautas para redes sociais que <span className="text-[#FCA311] underline decoration-[#FCA311]/40 underline-offset-8">atraem clientes reais</span> para o seu negócio.
        </h1>

        {/* Subtítulo */}
        <p className="text-sm sm:text-lg text-[#E5E5E5]/80 max-w-2xl mt-6 leading-relaxed">
          Sem bloqueio criativo e sem precisar pagar R$ 1.500/mês para uma agência. Receba o <strong>Mote</strong>, a <strong>Headline da Arte</strong>, a <strong>Legenda persuasiva</strong> e o <strong>Formato ideal</strong> adaptados ao seu nicho.
        </p>

        {/* Botões de Ação do Hero */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-8 w-full sm:w-auto">
          <Link href="/login" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-black text-sm h-12 px-8 rounded-xl shadow-xl shadow-[#FCA311]/25 cursor-pointer gap-2"
            >
              Criar Minhas 5 Pautas Gratuitas <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full border-[#E5E5E5]/20 bg-[#14213D] text-white hover:bg-[#000000] hover:text-[#FCA311] text-sm h-12 px-6 rounded-xl cursor-pointer"
            >
              Ver Demonstração do Painel
            </Button>
          </Link>
        </div>

        {/* Mini Prova Social */}
        <div className="flex items-center gap-4 mt-8 text-xs text-[#E5E5E5]/60">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Sem cartão de crédito
          </span>
          <span className="text-[#E5E5E5]/20">•</span>
          <span className="flex items-center gap-1 text-[#FCA311]">
            <Zap className="w-3.5 h-3.5" /> Gera em menos de 10 segundos
          </span>
          <span className="text-[#E5E5E5]/20">•</span>
          <span>Pronto para Canva e Redes</span>
        </div>

        {/* PREVIEW DO CARD DE PAUTA NO PADRÃO BLACK & GOLD ELEGANCE */}
        <div className="mt-14 w-full max-w-3xl text-left">
          <Card className="bg-[#14213D] border border-[#E5E5E5]/20 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-5 relative overflow-hidden backdrop-blur">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#14213D] via-[#FCA311] to-[#14213D]" />

            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E5E5]/10 pb-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-[#000000] text-[#FCA311] border border-[#FCA311]/40 text-xs font-bold">
                  EXEMPLO REAL: CLÍNICA ODONTOLÓGICA
                </Badge>
                <span className="text-xs text-[#E5E5E5]/60">Formato: Carrossel Educativo</span>
              </div>
              <span className="text-xs text-[#FCA311] font-mono font-bold">4 Blocos Completos</span>
            </div>

            {/* Mote */}
            <div>
              <span className="text-[10px] font-bold text-[#FCA311] uppercase tracking-wider block mb-1">
                1. Mote Estratégico
              </span>
              <p className="text-xs text-[#E5E5E5] leading-relaxed">
                Desmistificar o medo de dor e sensibilidade no clareamento dental, quebrando a objeção que impede o paciente de agendar.
              </p>
            </div>

            {/* Headline da Arte (2 Opções) */}
            <div className="p-3.5 bg-[#000000]/60 rounded-xl border border-[#E5E5E5]/10 space-y-2">
              <span className="text-[10px] font-bold text-[#FCA311] uppercase tracking-wider block">
                2. Headline da Arte (O que vai escrito na imagem do Canva):
              </span>
              <div className="text-xs font-bold text-white bg-[#14213D] p-2 rounded-lg border border-[#E5E5E5]/10">
                Opção A: "Você ainda foge do clareamento por medo de dor? ✨"
              </div>
              <div className="text-xs font-medium text-[#E5E5E5]/80 bg-[#14213D]/60 p-2 rounded-lg border border-[#E5E5E5]/10">
                Opção B: "O que ninguém te contou sobre a nova tecnologia sem sensibilidade."
              </div>
            </div>

            {/* Legenda com CTA */}
            <div>
              <span className="text-[10px] font-bold text-[#FCA311] uppercase tracking-wider block mb-1">
                3. Legenda com CTA para WhatsApp
              </span>
              <div className="p-3 bg-[#000000]/40 rounded-xl border border-[#E5E5E5]/10 text-xs text-[#E5E5E5] leading-relaxed line-clamp-3">
                A verdade é que a odontologia evoluiu — e você não precisa mais sofrer para ter o sorriso dos seus sonhos! 🦷✨ Com a nossa aplicação a laser, você conquista até 4 tons mais brancos com máximo conforto... Toque no link da bio e agende sua avaliação!
              </div>
            </div>

            {/* Formato Justificado */}
            <div className="text-[11px] text-[#E5E5E5]/70 bg-[#000000]/20 p-2.5 rounded-lg border border-[#E5E5E5]/5">
              <strong className="text-[#FCA311]">4. Formato com Justificativa:</strong> Carrossel de 3 Lâminas para conduzir o paciente do medo até o clique no link da bio.
            </div>
          </Card>
        </div>
      </section>

      {/* SEÇÃO DE BENEFÍCIOS */}
      <section className="border-t border-[#E5E5E5]/10 bg-[#000000] py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#FCA311] uppercase tracking-wider">Por que o Gera Pauta é diferente?</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Feito para quem tem um negócio e precisa de clientes, não de likes vazios.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <Card className="bg-[#14213D] border border-[#E5E5E5]/15 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FCA311]/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#FCA311]" />
              </div>
              <h3 className="text-base font-bold text-white">Memória de Marca Real</h3>
              <p className="text-xs text-[#E5E5E5]/70 leading-relaxed">
                Você cadastra seu nicho, seu tom de voz e as dores do seu cliente uma única vez. A IA nunca esquece quem é você.
              </p>
            </Card>

            <Card className="bg-[#14213D] border border-[#E5E5E5]/15 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FCA311]/40 flex items-center justify-center">
                <Layers className="w-5 h-5 text-[#FCA311]" />
              </div>
              <h3 className="text-base font-bold text-white">Pronto para o Designer e Canva</h3>
              <p className="text-xs text-[#E5E5E5]/70 leading-relaxed">
                Não entregamos apenas textos soltos. Entregamos a Headline exata que vai escrita em destaque na arte ou no primeiro segundo do Reels.
              </p>
            </Card>

            <Card className="bg-[#14213D] border border-[#E5E5E5]/15 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#000000] border border-[#FCA311]/40 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#FCA311]" />
              </div>
              <h3 className="text-base font-bold text-white">Foco em WhatsApp e Conversão</h3>
              <p className="text-xs text-[#E5E5E5]/70 leading-relaxed">
                As CTAs são calibradas para gerar agendamentos, directs e mensagens no WhatsApp da sua empresa, gerando faturamento real.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FOOTER ELEGANTE */}
      <footer className="border-t border-[#E5E5E5]/15 bg-[#14213D] py-8 text-xs text-[#E5E5E5]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#000000] border border-[#FCA311]/40 flex items-center justify-center font-bold text-[#FCA311] text-xs">
              GP
            </div>
            <span className="font-bold text-white">Gera Pauta</span>
            <span className="text-[#E5E5E5]/40">• Inteligência de Conteúdo para Pequenos Negócios</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/login" className="hover:text-[#FCA311] transition-colors">Entrar</Link>
            <Link href="/dashboard" className="hover:text-[#FCA311] transition-colors">Painel</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
