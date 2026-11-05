"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Por favor, insira um e-mail válido.");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // CADASTRO NO SUPABASE AUTH
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              company_name: companyName.trim() || undefined,
              full_name: companyName.trim() || undefined
            }
          }
        });

        if (error) {
          toast.error(error.message || "Falha ao criar conta. Tente novamente.");
          return;
        }

        toast.success("Conta criada com sucesso no Supabase! Bem-vindo(a).");
        
        if (typeof window !== "undefined") {
          localStorage.setItem("gera_pauta_user_email", email.trim());
          if (companyName) {
            localStorage.setItem("gera_pauta_company_name", companyName.trim());
          }
        }

        router.push("/onboarding");
      } else {
        // LOGIN NO SUPABASE AUTH
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (error) {
          toast.error(error.message === "Invalid login credentials" 
            ? "E-mail ou senha incorretos." 
            : error.message);
          return;
        }

        toast.success("Login realizado com sucesso!");
        
        if (typeof window !== "undefined") {
          localStorage.setItem("gera_pauta_user_email", email.trim());
        }

        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error("Erro inesperado na autenticação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined
        }
      });
      if (error) toast.error(error.message);
    } catch (err: any) {
      toast.error("Erro ao iniciar login com Google.");
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-center items-center px-4 py-12 selection:bg-[#FCA311]/30">
      {/* Botão de voltar para a Home */}
      <div className="w-full max-w-md mb-6">
        <Link 
          href="/" 
          className="text-xs text-[#E5E5E5]/70 hover:text-[#FCA311] transition-colors flex items-center gap-1.5 inline-flex"
        >
          ← Voltar para a página inicial
        </Link>
      </div>

      <Card className="w-full max-w-md bg-[#14213D] border border-[#E5E5E5]/15 p-6 sm:p-8 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur">
        {/* Glow de destaque no topo do card */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#14213D] via-[#FCA311] to-[#14213D]" />

        {/* Cabeçalho do Card */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#000000] border border-[#FCA311]/30 mx-auto flex items-center justify-center mb-3 shadow-lg">
            <Sparkles className="w-6 h-6 text-[#FCA311]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            {isSignUp ? "Crie sua conta no Gera Pauta" : "Bem-vindo(a) de volta"}
          </h1>
          <p className="text-xs text-[#E5E5E5]/80 mt-1.5">
            {isSignUp
              ? "Experimente 5 pautas estratégicas gratuitas para o seu negócio."
              : "Acesse suas marcas, personas e histórico de conteúdo."}
          </p>
        </div>

        {/* Formulário de Acesso */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <Label htmlFor="companyName">Nome da sua Empresa ou Agência</Label>
              <Input
                id="companyName"
                type="text"
                maxLength={100}
                placeholder="Ex: Clínica Sorriso / Hamburgueria Grill"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white placeholder:text-[#E5E5E5]/40 focus-visible:ring-[#FCA311] text-sm h-11"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail Profissional</Label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#E5E5E5]/50 absolute left-3 top-3.5" />
              <Input
                id="email"
                type="email"
                required
                maxLength={255}
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white placeholder:text-[#E5E5E5]/40 pl-9 focus-visible:ring-[#FCA311] text-sm h-11"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!email) {
                      toast.error("Digite seu e-mail no campo acima para recuperar a senha.");
                      return;
                    }
                    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
                    if (error) toast.error(error.message);
                    else toast.success("Link de redefinição de senha enviado para seu e-mail!");
                  }}
                  className="text-[11px] text-[#FCA311] hover:underline"
                >
                  Esqueceu a senha?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#E5E5E5]/50 absolute left-3 top-3.5" />
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                maxLength={100}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#000000]/60 border-[#E5E5E5]/20 text-white placeholder:text-[#E5E5E5]/40 pl-9 focus-visible:ring-[#FCA311] text-sm h-11"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-bold h-11 text-sm rounded-xl transition-all shadow-lg shadow-[#FCA311]/20 cursor-pointer mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Conectando ao Supabase...
              </span>
            ) : isSignUp ? (
              <span className="flex items-center justify-center gap-2">
                Criar Conta Gratuita <ArrowRight className="w-4 h-4" />
              </span>
            ) : (
              "Entrar na Plataforma"
            )}
          </Button>
        </form>

        {/* Divisor Visual */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E5E5]/15" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
            <span className="bg-[#14213D] px-2 text-[#E5E5E5]/60 font-semibold">ou continue com</span>
          </div>
        </div>

        {/* Botão Google OAuth */}
        <Button
          type="button"
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full border-[#E5E5E5]/20 bg-[#000000]/40 text-white hover:bg-[#000000] hover:text-[#FCA311] h-11 rounded-xl text-xs font-semibold cursor-pointer gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google
        </Button>

        {/* Alternador de Login / Cadastro */}
        <div className="text-center mt-6 text-xs text-[#E5E5E5]/80">
          {isSignUp ? (
            <p>
              Já possui uma conta?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-[#FCA311] font-bold hover:underline"
              >
                Fazer login
              </button>
            </p>
          ) : (
            <p>
              Ainda não tem conta?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-[#FCA311] font-bold hover:underline"
              >
                Cadastre-se grátis
              </button>
            </p>
          )}
        </div>
      </Card>

      {/* Badge de Conformidade */}
      <div className="flex items-center gap-1.5 text-xs text-[#E5E5E5]/50 mt-6">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Autenticação oficial protegida pelo Supabase</span>
      </div>
    </div>
  );
}
