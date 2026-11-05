# 🚀 Gera Pauta

> **Gerador Inteligente de Pautas para Redes Sociais contextualizado para Pequenos Negócios, Profissionais Liberais e Agências.**

---

## 📌 1. Visão Geral
O **Gera Pauta** resolve o problema das ideias genéricas do ChatGPT entregando pautas completas e persuasivas (Mote estratégico, 2 opções de Headline para a arte, Legenda com CTA otimizado e Formato ideal com justificativa) profundamente ancoradas no **nicho, tom de voz e personas do negócio**.

Conta com uma **Arquitetura Híbrida de IA**:
- **Plano Gratuito / Degustação:** 5 pautas geradas com IA de alta capacidade inclusa (sem custo para o usuário);
- **Plano Pago:** Assinatura via Stripe para desbloquear gerações contínuas, múltiplos clientes e opção de conectar sua própria chave (BYOK) para autonomia total.

---

## 🛠️ 2. Stack Técnica
- **Frontend:** Next.js 15/16 (App Router) + React 19 + TypeScript
- **Estilização & UI:** Tailwind CSS v4 + shadcn/ui + Lucide Icons + Sonner
- **Banco de Dados & Autenticação:** Supabase (PostgreSQL + Row Level Security)
- **Motores de IA:** Google Gemini API (`@google/genai`) + Groq Cloud (Llama 3.3 70B)
- **Pagamentos:** Stripe (Checkout transparente + Webhooks)

---

## 🚀 3. Como Rodar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Raphasq10/gera-pauta.git
   cd gera-pauta
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Copie o arquivo `.env.example` para `.env.local` e preencha suas chaves:
   ```bash
   cp .env.example .env.local
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse no navegador:**
   Abra [http://localhost:3000](http://localhost:3000)
