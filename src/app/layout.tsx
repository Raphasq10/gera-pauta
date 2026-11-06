import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gera Pauta • Gerador de Conteúdo e Pautas Inteligentes com IA",
  description: "Plataforma inteligente de criação e planejamento de pautas estratégicas para Instagram, TikTok, LinkedIn e WhatsApp.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} font-sans h-full antialiased dark`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans bg-[#0D0C1D] text-slate-100"
      >
        {children}
      </body>
    </html>
  );
}

