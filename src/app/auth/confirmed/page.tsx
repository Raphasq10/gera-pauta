"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Sparkles, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function ConfirmedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextRoute = searchParams.get("next") || "/onboarding";

  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(nextRoute);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, nextRoute]);

  return (
    <div className="min-h-screen bg-[#050914] text-white flex flex-col justify-center items-center px-4 py-12 selection:bg-[#FCA311]/30">
      <Card className="w-full max-w-md bg-[#14213D] border border-slate-700 p-8 rounded-3xl shadow-2xl text-center space-y-6 relative overflow-hidden backdrop-blur">
        
        {/* Glow dourado de celebração */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-[#FCA311] to-emerald-500" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#FCA311]/15 blur-[80px] rounded-full pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400 shadow-xl">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> E-mail Verificado
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Conta Ativada com Sucesso!
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            Sua conta está pronta e você já tem <strong>5 pautas cortesia</strong> liberadas para o seu negócio.
          </p>
        </div>

        <div className="bg-[#050914] p-4 rounded-xl border border-slate-700/80 text-xs text-slate-300 flex items-center justify-between">
          <span>Redirecionando em:</span>
          <span className="font-mono text-sm font-black text-[#FCA311]">{countdown}s</span>
        </div>

        <Link href={nextRoute} className="block w-full">
          <Button className="w-full bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-extrabold h-12 rounded-xl text-sm shadow-xl shadow-[#FCA311]/25 cursor-pointer gap-2">
            Continuar para o Onboarding <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>

      </Card>
    </div>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050914] flex items-center justify-center text-white">
        <RefreshCw className="w-6 h-6 animate-spin text-[#FCA311]" />
      </div>
    }>
      <ConfirmedContent />
    </Suspense>
  );
}
