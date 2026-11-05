# 🚀 INSTRUÇÃO MESTRE / PROMPT DE INICIALIZAÇÃO — PROJETO COMERCIAL (INOVAPAUTA AI / PAUTASaaS)

> **Instrução para a IA Antigravity:** Leia este documento com prioridade máxima. Você está assumindo a liderança técnica e de produto deste repositório para transformá-lo de uma ferramenta de evento único em um **SaaS Comercial Escalável (B2B / Multi-tenant)** de geração de conteúdo e pautas com IA.

---

## 📌 1. Visão Geral do Projeto Atual
Este projeto começou como o **InovaPauta AI**, desenvolvido para a equipe de comunicação do **Festival Iguassu Inova 2026**. Ele é uma aplicação web completa desenvolvida em:
- **Framework:** Next.js (App Router) + React 19 + TypeScript.
- **Estilização & Componentes:** Tailwind CSS + shadcn/ui + Radix UI + Lucide Icons.
- **Inteligência Artificial:** Google Gemini AI (com integração direta via REST API e SDK `@google/genai`, suporte a fallback inteligente e orquestração de prompts com ganchos de tráfego pago, AIDA e FOMO).
- **Processamento de Dados:** SheetJS (`xlsx`) para leitura de dados demográficos de público/inscritos.
- **Validação de Schemas:** Zod em todas as requisições de API e formulários.
- **Deploy:** 100% pronto e compatível com Vercel (arquitetura serverless-ready).

---

## 🎯 2. O Grande Objetivo: Transformação em Produto Comercial (SaaS)
Queremos transformar esta base sólida em um **software comercializável** para agências de marketing, criadores de conteúdo, organizadores de eventos e empresas.

### O que o produto precisa se tornar:
1. **Multi-marca / Multi-cliente (Workspaces):**
   - Em vez de ser travado no "Festival Iguassu Inova", o usuário/agência poderá cadastrar **seus próprios clientes ou projetos** (ex: "Clínica Odonto", "E-commerce X", "Conferência Tech").
   - Cada projeto terá seu próprio Hub de Novidades, Linhas Editoriais e Personas customizadas.
2. **Importação Universal de Públicos:**
   - O usuário pode subir qualquer planilha (`.xlsx` ou `.csv`) com dados de leads, clientes ou seguidores, e o sistema mapeia e gera as personas automaticamente.
3. **Autenticação & Banco de Dados na Nuvem (SaaS Multi-usuário):**
   - Migrar da persistência em `localStorage` / arquivo JSON para um banco na nuvem: **Supabase** (PostgreSQL + Supabase Auth + Row Level Security).
   - Cada usuário tem sua conta (login com Google / E-mail), seus dados isolados e seu histórico na nuvem.
4. **Monetização & Planos de Assinatura:**
   - Integração com **Stripe** ou **Asaas** (Pix / Cartão).
   - Planos (ex: Free com limite de 10 pautas/mês, Pro com pautas ilimitadas e múltiplos clientes, Agency para times).
   - Sistema de consumo de créditos/tokens de IA por usuário.
5. **Exportação & Integrações:**
   - Exportar pautas em PDF profissional com a identidade da agência, CSV para Meta Ads / agendadores, ou envio direto para Trello/Notion.

---

## 🛠️ 3. Passos Imediatos de Inicialização nesta Nova Máquina
Ao iniciar nesta máquina, execute os seguintes passos de diagnóstico:

1. **Instalar Dependências:**
   ```bash
   npm install
   ```
2. **Configurar Ambiente (.env.local):**
   - Certifique-se de que o arquivo `.env.local` contém:
     ```env
     GEMINI_API_KEY="SUA_CHAVE_AQUI"
     ```
3. **Verificar a Build de Produção:**
   ```bash
   npm run build
   ```
4. **Rodar em Modo Dev:**
   ```bash
   npm run dev
   ```
5. **Apresentar o Plano de Ação:**
   - Apresente ao usuário o roadmap dividido em fases (MVP Comercial, Integração com Supabase, Sistema de Workspaces, Billing Stripe) e pergunte por qual fase ele deseja começar!
