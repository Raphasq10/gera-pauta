"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Lock, 
  RefreshCw, 
  KeyRound, 
  CheckCircle2, 
  ExternalLink,
  Inbox,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { 
  loginSchema, 
  signUpSchema, 
  resetPasswordSchema, 
  type LoginInput, 
  type SignUpInput,
  type ResetPasswordInput
} from "@/lib/schemas/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  // Modos de Visualização
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  // Estado para tela dedicada de "Verifique seu e-mail"
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Timer de Cooldown para Reenvio
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Formulários com Zod
  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const signUpForm = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { companyName: "", email: "", password: "" },
    mode: "onBlur",
  });

  const resetForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  // SUBMISSÃO DE LOGIN
  const onLoginSubmit = async (data: LoginInput) => {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("invalid login credentials")) {
          toast.error("E-mail ou senha incorretos. Verifique suas credenciais.");
        } else if (error.message.toLowerCase().includes("email not confirmed")) {
          toast.error("Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.");
          setPendingConfirmationEmail(data.email);
        } else {
          toast.error(error.message || "Falha ao realizar login.");
        }
        return;
      }

      toast.success("Login realizado com sucesso! Redirecionando...");
      
      if (typeof window !== "undefined") {
        localStorage.setItem("gera_pauta_user_email", data.email);
      }

      router.push(redirectTarget);
      router.refresh();
    } catch {
      toast.error("Falha na conexão com o servidor. Verifique sua internet.");
    }
  };

  // SUBMISSÃO DE CADASTRO
  const onSignUpSubmit = async (data: SignUpInput) => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            company_name: data.companyName || undefined,
            full_name: data.companyName || undefined,
          },
          emailRedirectTo: typeof window !== "undefined" 
            ? `${window.location.origin}/api/auth/callback?next=/onboarding`
            : undefined,
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes("user already registered")) {
          toast.error("Este e-mail já está cadastrado. Tente fazer login.");
        } else if (error.message.toLowerCase().includes("rate limit") || error.message.toLowerCase().includes("security purposes")) {
          toast.error("Muitas tentativas em pouco tempo. Aguarde 60 segundos.");
        } else {
          toast.error(error.message || "Falha ao criar conta.");
        }
        return;
      }

      // Se a confirmação de e-mail estiver desativada no Supabase, loga na hora
      if (authData.session) {
        toast.success("Conta criada com sucesso! Bem-vindo(a) ao Gera Pauta.");
        if (typeof window !== "undefined") {
          localStorage.setItem("gera_pauta_user_email", data.email);
          if (data.companyName) {
            localStorage.setItem("gera_pauta_company_name", data.companyName);
          }
        }
        router.push("/onboarding");
        router.refresh();
      } else {
        // Se a confirmação de e-mail estiver ativada, exibe a tela dedicada!
        setPendingConfirmationEmail(data.email);
        setResendCooldown(60);
        toast.success("Quase lá! Enviamos um e-mail de ativação para você.");
      }
    } catch {
      toast.error("Falha ao criar conta. Tente novamente.");
    }
  };

  // REENVIAR E-MAIL DE ATIVAÇÃO
  const handleResendConfirmation = async () => {
    if (!pendingConfirmationEmail || resendCooldown > 0) return;
    setIsResending(true);

    try {
      const res = await fetch("/api/auth/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingConfirmationEmail }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Não foi possível reenviar o e-mail.");
        return;
      }

      toast.success("E-mail de confirmação reenviado com sucesso!");
      setResendCooldown(60);
    } catch {
      toast.error("Erro ao solicitar reenvio. Tente novamente.");
    } finally {
      setIsResending(false);
    }
  };

  // RECUPERAÇÃO DE SENHA
  const onResetSubmit = async (data: ResetPasswordInput) => {
    setIsResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email);
      if (error) {
        toast.error(error.message || "Não foi possível enviar o e-mail.");
        return;
      }

      toast.success("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
      setIsResetModalOpen(false);
      resetForm.reset();
    } catch {
      toast.error("Erro ao solicitar redefinição. Tente novamente.");
    } finally {
      setIsResetting(false);
    }
  };

  // Google OAuth
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" 
            ? `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(redirectTarget)}` 
            : undefined,
        },
      });
      if (error) toast.error(error.message);
    } catch {
      toast.error("Erro ao iniciar login com Google.");
    }
  };

  const isSubmitting = loginForm.formState.isSubmitting || signUpForm.formState.isSubmitting;

  return (
    <div className="min-h-screen bg-[#050914] text-white flex flex-col justify-center items-center px-4 py-12 selection:bg-[#FCA311]/30">
      
      {/* Botão de voltar */}
      <div className="w-full max-w-md mb-6">
        <Link 
          href="/" 
          className="text-xs text-slate-400 hover:text-[#FCA311] transition-colors flex items-center gap-1.5 inline-flex font-medium"
        >
          ← Voltar para a página inicial
        </Link>
      </div>

      <Card className="w-full max-w-md bg-[#14213D] border border-slate-700/80 p-6 sm:p-8 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#14213D] via-[#FCA311] to-[#14213D]" />

        {/* ========================================================
            TELA DEDICADA: CONFIRME SEU E-MAIL
        ======================================================== */}
        {pendingConfirmationEmail ? (
          <div className="text-center space-y-6 py-2">
            
            <div className="relative w-16 h-16 rounded-2xl bg-amber-500/10 border border-[#FCA311]/40 mx-auto flex items-center justify-center text-[#FCA311] shadow-xl">
              <Mail className="w-8 h-8 animate-bounce duration-1000" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FCA311] flex items-center justify-center text-[10px] text-black font-black">
                1
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Confirme seu E-mail
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                Para sua segurança, enviamos um link de confirmação para o endereço:
              </p>
              <div className="p-2.5 rounded-xl bg-[#050914] border border-[#FCA311]/30 font-mono text-xs text-[#FCA311] font-bold break-all">
                {pendingConfirmationEmail}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/80 text-left text-xs text-slate-300 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Clique no botão <strong>"Confirm your mail"</strong> no e-mail recebido.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Não encontrou? Dê uma olhada na pasta de <strong>Spam</strong> ou <strong>Lixeira</strong>.</span>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="space-y-3 pt-2">
              {/* Botão de Atalho para o Gmail */}
              {pendingConfirmationEmail.includes("@gmail.com") && (
                <a 
                  href="https://mail.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button 
                    type="button"
                    className="w-full bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-extrabold h-11 text-xs rounded-xl shadow-lg shadow-[#FCA311]/20 cursor-pointer gap-2"
                  >
                    <ExternalLink className="w-4 h-4" /> Abrir meu Gmail Agora
                  </Button>
                </a>
              )}

              {/* Botão de Reenviar E-mail */}
              <Button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resendCooldown > 0 || isResending}
                variant="outline"
                className="w-full border-slate-700 bg-[#050914] text-white hover:bg-black hover:text-[#FCA311] h-11 rounded-xl text-xs font-semibold cursor-pointer gap-2"
              >
                {isResending ? (
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Reenviando...
                  </span>
                ) : resendCooldown > 0 ? (
                  <span>Reenviar e-mail em {resendCooldown}s</span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" /> Não recebi o e-mail, reenviar
                  </span>
                )}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setPendingConfirmationEmail(null);
                  setIsSignUp(false);
                }}
                className="text-xs text-slate-400 hover:text-white underline pt-1 block mx-auto cursor-pointer"
              >
                Já confirmei meu e-mail, fazer login ➔
              </button>
            </div>

          </div>
        ) : (
          /* ========================================================
              FORMULÁRIOS DE LOGIN E CADASTRO
          ======================================================== */
          <>
            {/* Cabeçalho */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#050914] border border-[#FCA311]/40 mx-auto flex items-center justify-center mb-3 shadow-lg">
                <Sparkles className="w-6 h-6 text-[#FCA311]" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                {isSignUp ? "Crie sua conta gratuita" : "Bem-vindo(a) de volta"}
              </h1>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {isSignUp
                  ? "Experimente 5 pautas estratégicas com Mote, Arte do Canva e Legenda sem cartão."
                  : "Acesse suas marcas, personas salvas e histórico de conteúdo."}
              </p>
            </div>

            {/* FORMULÁRIO DE LOGIN */}
            {!isSignUp ? (
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email">E-mail Profissional</Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <Input
                      id="login-email"
                      type="email"
                      maxLength={255}
                      placeholder="seu@email.com"
                      {...loginForm.register("email")}
                      className="bg-[#050914] border-slate-700 text-white placeholder:text-slate-500 pl-9 focus-visible:ring-[#FCA311] text-sm h-11"
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-[11px] text-rose-400 font-medium">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Senha de Acesso</Label>
                    <button
                      type="button"
                      onClick={() => setIsResetModalOpen(true)}
                      className="text-[11px] text-[#FCA311] hover:underline cursor-pointer font-medium"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <Input
                      id="login-password"
                      type="password"
                      maxLength={100}
                      placeholder="••••••••"
                      {...loginForm.register("password")}
                      className="bg-[#050914] border-slate-700 text-white placeholder:text-slate-500 pl-9 focus-visible:ring-[#FCA311] text-sm h-11"
                    />
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-[11px] text-rose-400 font-medium">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-extrabold h-11 text-sm rounded-xl transition-all shadow-lg shadow-[#FCA311]/20 cursor-pointer mt-2"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Verificando credenciais...
                    </span>
                  ) : (
                    "Entrar na Plataforma"
                  )}
                </Button>
              </form>
            ) : (
              /* FORMULÁRIO DE CADASTRO */
              <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-company">Nome da sua Empresa ou Agência (Opcional)</Label>
                  <Input
                    id="signup-company"
                    type="text"
                    maxLength={100}
                    placeholder="Ex: Clínica Sorriso / Hamburgueria Grill"
                    {...signUpForm.register("companyName")}
                    className="bg-[#050914] border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-[#FCA311] text-sm h-11"
                  />
                  {signUpForm.formState.errors.companyName && (
                    <p className="text-[11px] text-rose-400 font-medium">
                      {signUpForm.formState.errors.companyName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-email">E-mail Profissional</Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <Input
                      id="signup-email"
                      type="email"
                      maxLength={255}
                      placeholder="seu@email.com"
                      {...signUpForm.register("email")}
                      className="bg-[#050914] border-slate-700 text-white placeholder:text-slate-500 pl-9 focus-visible:ring-[#FCA311] text-sm h-11"
                    />
                  </div>
                  {signUpForm.formState.errors.email && (
                    <p className="text-[11px] text-rose-400 font-medium">
                      {signUpForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-password">Crie uma Senha Segura (mínimo 6 dígitos)</Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <Input
                      id="signup-password"
                      type="password"
                      maxLength={100}
                      placeholder="••••••••"
                      {...signUpForm.register("password")}
                      className="bg-[#050914] border-slate-700 text-white placeholder:text-slate-500 pl-9 focus-visible:ring-[#FCA311] text-sm h-11"
                    />
                  </div>
                  {signUpForm.formState.errors.password && (
                    <p className="text-[11px] text-rose-400 font-medium">
                      {signUpForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-extrabold h-11 text-sm rounded-xl transition-all shadow-lg shadow-[#FCA311]/20 cursor-pointer mt-2"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Criando sua conta...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Criar Minha Conta Grátis <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            )}

            {/* Divisor */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-[#14213D] px-2 text-slate-400 font-semibold">ou continue com</span>
              </div>
            </div>

            {/* Botão Google OAuth */}
            <Button
              type="button"
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full border-slate-700 bg-[#050914] text-white hover:bg-black hover:text-[#FCA311] h-11 rounded-xl text-xs font-semibold cursor-pointer gap-2"
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
              Entrar com conta Google
            </Button>

            {/* Alternador Login / Cadastro */}
            <div className="text-center mt-6 text-xs text-slate-300">
              {isSignUp ? (
                <p>
                  Já possui uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="text-[#FCA311] font-bold hover:underline cursor-pointer"
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
                    className="text-[#FCA311] font-bold hover:underline cursor-pointer"
                  >
                    Cadastre-se grátis
                  </button>
                </p>
              )}
            </div>
          </>
        )}
      </Card>

      {/* MODAL DE RECUPERAÇÃO DE SENHA */}
      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent className="bg-[#14213D] border border-slate-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
              <KeyRound className="w-5 h-5 text-[#FCA311]" /> Recuperar Acesso
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-300">
              Digite o e-mail cadastrado. Enviaremos um link seguro para você redefinir sua senha.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="reset-email">Seu E-mail Cadastrado</Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <Input
                  id="reset-email"
                  type="email"
                  maxLength={255}
                  placeholder="seu@email.com"
                  {...resetForm.register("email")}
                  className="bg-[#050914] border-slate-700 text-white placeholder:text-slate-500 pl-9 focus-visible:ring-[#FCA311] text-sm h-11"
                />
              </div>
              {resetForm.formState.errors.email && (
                <p className="text-[11px] text-rose-400 font-medium">
                  {resetForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsResetModalOpen(false)}
                className="text-xs text-slate-300 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isResetting}
                className="bg-[#FCA311] hover:bg-[#FCA311]/90 text-black font-bold text-xs h-10 px-4 rounded-xl cursor-pointer"
              >
                {isResetting ? (
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Enviando...
                  </span>
                ) : (
                  "Enviar Link de Redefinição"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Badge de Conformidade */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-6">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Sessão segura com JWT & Supabase Auth</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050914] flex items-center justify-center text-white">
        <RefreshCw className="w-6 h-6 animate-spin text-[#FCA311]" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
