"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, XCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-center items-center px-4 py-12 selection:bg-[#FCA311]/30">
      <Card className="w-full max-w-md bg-[#14213D] border border-[#E5E5E5]/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#000000] border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400 shadow-xl">
          <XCircle className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white tracking-tight">
            Assinatura não concluída
          </h1>
          <p className="text-xs text-[#E5E5E5]/80 leading-relaxed">
            O processo de checkout foi cancelado. Nenhuma cobrança foi realizada no seu cartão.
          </p>
        </div>

        <div className="p-4 bg-[#000000]/40 rounded-2xl border border-[#E5E5E5]/10 text-xs text-[#E5E5E5]/70 space-y-1">
          <p>Você continua no plano gratuito com acesso às suas pautas salvas no histórico.</p>
        </div>

        <div className="space-y-2 pt-2">
          <Link href="/dashboard">
            <Button className="w-full bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-extrabold h-11 text-xs rounded-xl shadow-lg cursor-pointer gap-2">
              <ArrowLeft className="w-4 h-4" /> Voltar para o Dashboard
            </Button>
          </Link>
          <Link href="/planos">
            <Button variant="ghost" className="w-full text-xs text-[#E5E5E5]/70 hover:text-white h-10">
              Ver outros planos disponíveis
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
