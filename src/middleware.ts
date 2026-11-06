import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * ============================================================================
 * MIDDLEWARE DE AUTENTICAÇÃO E PROTEÇÃO DE ROTAS (NEXT.JS + SUPABASE)
 * ============================================================================
 * 
 * O que este arquivo faz:
 * 1. Sincroniza cookies de sessão (JWT) entre o navegador e o servidor.
 * 2. Protege rotas restritas: se alguém tentar acessar '/dashboard' ou '/onboarding'
 *    sem estar logado, é redirecionado imediatamente para '/login'.
 * 3. Se um usuário já autenticado tentar acessar '/login', é redirecionado para '/dashboard'.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jlvwallwcrpibawrxsgt.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_mfANl-Hwb367wt8S_-lAxg_xPhhXurR";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Regra 0: Se a requisição veio de um link de e-mail do Supabase com '?code=...',
  // redireciona para a rota de callback para efetuar a troca pelo token de sessão
  const code = request.nextUrl.searchParams.get("code");
  if (code && !request.nextUrl.pathname.startsWith("/api/auth/callback")) {
    const callbackUrl = request.nextUrl.clone();
    callbackUrl.pathname = "/api/auth/callback";
    return NextResponse.redirect(callbackUrl);
  }

  // Validação segura com getUser() (evita falsificação de JWT local)
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname === "/login";
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding");

  // Regra 1: Redirecionar visitante não logado que tenta acessar rota protegida
  if (!user && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Regra 2: Redirecionar usuário já logado que tenta acessar /login novamente
  if (user && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Ignora arquivos estáticos (_next, imagens, favicon, etc)
     * e rotas de API públicas para não adicionar sobrecarga desnecessária.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
