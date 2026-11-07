"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isActivating, setIsActivating] = useState(true);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    async function activatePro() {
      try {
        const res = await fetch("/api/checkout/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId })
        });
        if (res.ok) {
          setActivated(true);
        }
      } catch {
        // Safe fallback
      } finally {
        setIsActivating(false);
      }
    }

    activatePro();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-center items-center px-4 py-12 selection:bg-[#FCA311]/30">
      <Card className="w-full max-w-lg bg-[#14213D] border-2 border-[#FCA311] p-8 rounded-3xl shadow-2xl relative overflow-hidden text-center space-y-6">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#14213D] via-[#FCA311] to-[#14213D]" />

        {/* Ícone de Sucesso */}
        <div className="w-16 h-16 rounded-2xl bg-[#000000] border-2 border-[#FCA311] flex items-center justify-center mx-auto text-[#FCA311] shadow-xl">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        {/* Título e Subtítulo */}
        <div className="space-y-2">
          <Badge className="bg-[#FCA311] text-black font-extrabold text-[10px] uppercase tracking-wider px-3 py-1">
            Assinatura Ativada com Sucesso
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Bem-vindo(a) ao Plano PRO! 🚀
          </h1>
          <p className="text-xs sm:text-sm text-[#E5E5E5]/80 leading-relaxed max-w-sm mx-auto">
            Seu pagamento foi confirmado com segurança. A cota gratuita foi removida e você agora tem acesso ilimitado para gerar pautas de alta conversão.
          </p>
        </div>

        {/* Benefícios Liberados Imediatamente */}
        <div className="p-4 bg-[#000000]/60 rounded-2xl border border-[#E5E5E5]/10 text-left space-y-2.5 text-xs text-[#E5E5E5]">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Gerações ilimitadas liberadas</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FCA311] shrink-0" />
            <span>Todos os 4 canais ativos (Instagram, LinkedIn, WhatsApp, TikTok)</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FCA311] shrink-0" />
            <span>Refinamento e ajuste de pautas com IA em tempo real</span>
          </div>
        </div>

        {/* Botão de Ação */}
        <div className="pt-2">
          <Link href="/dashboard">
            <Button className="w-full bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-extrabold h-12 text-sm rounded-xl shadow-lg shadow-[#FCA311]/25 cursor-pointer gap-2">
              Ir para o Dashboard e Criar Pautas <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <p className="text-[11px] text-[#E5E5E5]/50 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Transação processada de forma 100% segura
        </p>
      </Card>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#000000] flex items-center justify-center text-white">Carregando confirmação...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
