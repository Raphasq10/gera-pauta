"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  HelpCircle, 
  Lock, 
  RefreshCw,
  CreditCard,
  Building2,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function PlanosPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

  const handleCheckout = async (planId: "pro_monthly" | "pro_annual") => {
    setIsLoadingCheckout(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingInterval: billingCycle })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 401) {
          toast.error("Por favor, faça login para assinar o Plano Pro.");
          window.location.href = "/login?redirect=/planos";
          return;
        }
        throw new Error(data.error || "Não foi possível iniciar o checkout.");
      }

      if (data.url) {
        toast.success("Redirecionando para o checkout seguro...");
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast.error(err.message || "Erro de conexão ao iniciar o checkout.");
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0C1D] text-white flex flex-col font-sans selection:bg-[#FFB020]/30">
      {/* HEADER SIMPLES */}
      <header className="border-b border-[#F8FAFC]/15 bg-[#1E1B4B] py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/images/logo.png" 
              alt="Gera Pauta" 
              className="h-8 w-auto object-contain group-hover:scale-105 transition-transform" 
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-xs text-[#F8FAFC]/80 hover:text-white">
                Voltar ao Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge className="bg-[#1E1B4B] border border-[#FFB020]/40 text-[#FFB020] text-xs font-bold px-3 py-1">
            ⚡ Planos Transparentes & Sem Pegadinhas
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Crie conteúdo estratégico sem travas e sem limites.
          </h1>
          <p className="text-sm sm:text-base text-[#F8FAFC]/70 leading-relaxed">
            Economize mais de 20 horas por mês na criação de pautas, legendas e ganchos de alta conversão para seus clientes.
          </p>

          {/* TOGGLE MENSAL / ANUAL */}
          <div className="inline-flex items-center gap-2 p-1.5 bg-[#1E1B4B] border border-[#F8FAFC]/20 rounded-2xl shadow-xl mt-4">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-[#FFB020] text-black shadow-md"
                  : "text-[#F8FAFC]/70 hover:text-white"
              }`}
            >
              Faturamento Mensal
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-[#FFB020] text-black shadow-md"
                  : "text-[#F8FAFC]/70 hover:text-white"
              }`}
            >
              <span>Faturamento Anual</span>
              <span className="bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                17% OFF
              </span>
            </button>
          </div>
        </div>

        {/* CARDS COMPARATIVOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card Grátis */}
          <Card className="bg-[#1E1B4B]/60 border border-[#F8FAFC]/15 p-8 rounded-3xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#F8FAFC]/60 uppercase tracking-wider">Degustação</span>
                <h3 className="text-2xl font-black text-white">Plano Grátis</h3>
                <div className="pt-2">
                  <span className="text-4xl font-black text-white">R$ 0</span>
                  <span className="text-xs text-[#F8FAFC]/60 block mt-1">Para experimentar e validar</span>
                </div>
              </div>

              <ul className="space-y-3 pt-4 border-t border-[#F8FAFC]/10 text-xs text-[#F8FAFC]/80">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>5 pautas estruturadas de teste</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1 Perfil de Negócio (Memória de Marca)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>2 opções de Headline da Arte</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#F8FAFC]/40">
                  <span>✕ Suporte prioritário via WhatsApp</span>
                </li>
              </ul>
            </div>

            <Link href="/dashboard">
              <Button variant="outline" className="w-full border-[#F8FAFC]/20 text-[#F8FAFC] text-xs h-11 rounded-xl hover:bg-[#0D0C1D]">
                Usar Modo Gratuito
              </Button>
            </Link>
          </Card>

          {/* Card PRO (Destaque) */}
          <Card className="bg-[#1E1B4B] border-2 border-[#FFB020] p-8 rounded-3xl space-y-6 relative shadow-2xl flex flex-col justify-between">
            <div className="absolute -top-3.5 right-6">
              <Badge className="bg-[#FFB020] text-black font-black text-[10px] px-3 py-1 uppercase tracking-wider shadow-lg">
                RECOMENDADO
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#FFB020] uppercase tracking-wider">Acesso Ilimitado</span>
                <h3 className="text-2xl font-black text-white">Plano PRO</h3>
                <div className="pt-2">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === "monthly" ? "R$ 47" : "R$ 39"}
                  </span>
                  <span className="text-xs text-[#F8FAFC]/60 font-normal ml-1.5">
                    / mês {billingCycle === "annual" ? "(faturado anualmente R$ 468)" : ""}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 pt-4 border-t border-[#F8FAFC]/10 text-xs text-[#F8FAFC]">
                <li className="flex items-center gap-2.5 font-bold text-white">
                  <Check className="w-4 h-4 text-[#FFB020] shrink-0" />
                  <span>Pautas ilimitadas sem limite de créditos</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#FFB020] shrink-0" />
                  <span>Todos os 4 canais: Instagram, LinkedIn, WhatsApp e TikTok</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#FFB020] shrink-0" />
                  <span>Refazer e Ajustar pautas ilimitado com IA</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#FFB020] shrink-0" />
                  <span>Histórico completo de pautas sincronizado no Supabase</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#FFB020] shrink-0" />
                  <span>Suporte prioritário via WhatsApp</span>
                </li>
              </ul>
            </div>

            <Button
              disabled={isLoadingCheckout}
              onClick={() => handleCheckout(billingCycle === "monthly" ? "pro_monthly" : "pro_annual")}
              className="w-full bg-[#FFB020] hover:bg-[#FFB020]/90 text-black font-black text-sm h-12 rounded-xl shadow-lg shadow-[#FFB020]/25 cursor-pointer gap-2"
            >
              {isLoadingCheckout ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Conectando ao Checkout Seguro...
                </>
              ) : (
                <>
                  Assinar Plano PRO Agora <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </Card>
        </div>

        {/* SELOS DE SEGURANÇA E CONFIANÇA */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-6 border-t border-[#F8FAFC]/10 text-center">
          <div className="flex flex-col items-center gap-1.5 p-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="text-xs font-bold text-white">Pagamento Seguro</h4>
            <p className="text-[11px] text-[#F8FAFC]/60">Processamento oficial com criptografia Stripe.</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-3">
            <Zap className="w-5 h-5 text-[#FFB020]" />
            <h4 className="text-xs font-bold text-white">Ativação Imediata</h4>
            <p className="text-[11px] text-[#F8FAFC]/60">Gerações liberadas no mesmo segundo da confirmação.</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-3">
            <HelpCircle className="w-5 h-5 text-sky-400" />
            <h4 className="text-xs font-bold text-white">Garantia de 7 Dias</h4>
            <p className="text-[11px] text-[#F8FAFC]/60">Cancele quando quiser diretamente pelo painel.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
