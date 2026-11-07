# 📋 Registro de Evolução, Arquitetura e Estruturas Must Have
> **Projeto:** Gera Pauta — Plataforma de Geração Estratégica de Conteúdo com Inteligência Artificial  
> **Data de Atualização:** 07 de Novembro de 2026 às 01:45 (Horário de Brasília)  
> **Status:** Ativo e em evolução contínua  

---

## 🎯 1. Visão Geral e Filosofia do Produto (Must Have)
O **Gera Pauta** não é apenas um "gerador de texto aleatório", mas sim um **Diretor de Criação & Estrategista de Conteúdo Digital** que atua como um copywriter sênior dedicado ao negócio do cliente.

A premissa fundamental da IA no Gera Pauta é:
> **"Mais contexto estruturado e orientado a conversão = Pautas infinitamente superiores."**

Texto solto ou genérico gera diluição de atenção no modelo (alucinação ou clichês). Informações cirúrgicas (Dores reais, Objeções secretas, Desejos imediatos, Diferenciais tangíveis e Restrições de "O que NUNCA falar") transformam o resultado em pautas que geram vendas e engajamento real.

---

## 🏗️ 2. Estruturas Centrais do Sistema (Must Have)

### 🏢 Estrutura A: Memória de Marca (Perfil da Empresa)
Contexto fixo que orienta a IA sobre a identidade, diferenciais e limites da empresa:

| Campo Estrutural | Tipo | Impacto no Motor de IA |
| :--- | :--- | :--- |
| `companyName` | `string` | Identificação e assinatura da marca no conteúdo |
| `niche` | `string` | Contexto de mercado e terminologia do segmento |
| `differential` | `string` | Argumento de autoridade e fechamento de cada pauta |
| `mainProduct` | `string` | Oferta ou serviço carro-chefe que direciona a CTA |
| `toneOfVoice` | `string` | Personalidade do texto (ex: acolhedor, sofisticado, direto) |
| `forbiddenWords` | `string` | **Diretriz Negativa:** O que a IA é proibida de falar (clichês, jargões ou termos proibidos por conselhos de classe) |
| `keyPain` | `string` | Maior dor geral resolvida pelo negócio |

### 👥 Estrutura B: Cadastro & Gestão de Personas (Público-Alvo)
Permite que o usuário cadastre múltiplos perfis de clientes para variar os ângulos de conteúdo:

| Campo da Persona | Tipo | Impacto no Motor de IA |
| :--- | :--- | :--- |
| `id` | `string` | Identificador único |
| `name` | `string` | Nome humanizado para identificação rápida (ex: *Mariana*, *Dr. Marcos*) |
| `role` | `string` | Ocupação / Perfil demográfico e comportamental |
| `keyPain` | `string` | **Dor Principal:** O problema que tira o sono dessa persona |
| `desire` | `string` | **Maior Desejo:** A transformação ou alívio que ela busca sentir/alcançar |
| `objection` | `string` | **Objeção Oculta:** O receio que a impede de agir (ex: achar que dói, que é caro) |
| `category` | `string` | Tag de nicho/categoria visual |

### ⚡ Estrutura C: Motor de Geração Multicanal & Resiliência em 3 Níveis
1. **Nível 1 (BYOK do Usuário):** Chave gratuita de API do Google AI Studio salva e criptografada (AES-256) no perfil.
2. **Nível 2 (Sistema Oficial):** Chave oficial Gemini do servidor com alta velocidade e fallback inteligente.
3. **Nível 3 (Motor Local Offline Contextualizado):** Motor heurístico com 100% de disponibilidade mesmo sem internet/API.

---

## ⏱️ 3. Linha do Tempo e Histórico de Entregas (com Data e Hora)

### 📅 07/11/2026 — 01:45: Gestão Completa de Personas (CRUD) & Memória de Marca Turbinada
* **O que foi feito:**
  - **CRUD Completo de Personas na Aba 3:** Criação de modal (`Dialog`) para adicionar novas personas personalizadas, editar existentes e remover.
  - **Campos Cirúrgicos de Copywriting:** Cadastro de Dor Central, Maior Desejo/Transformação e Objeção Oculta que a IA deve quebrar na copy.
  - **Memória de Marca Expandida:** Adicionados campos de Diferencial Competitivo Único, Serviço Carro-Chefe e Diretrizes Negativas ("O que NUNCA falar" / Termos proibidos).
  - **Integração no Gerador (Aba 1):** Botões dinâmicos com contagem real, preview de Dor, Objeção e Desejo em tempo real e atalho de gerenciamento.
  - **Injeção Estratégica na API:** `/api/generate` e `/api/refine` agora alimentam o prompt do Gemini com todos os dados da persona e da marca.

### 📅 07/11/2026 — 01:22: Visualização de Data em Todos os Cards
* **O que foi feito:**
  - Adicionado badge com ícone de calendário (`Calendar` do `lucide-react`) em **todos os cards de pauta**, tanto no card de destaque quanto na galeria de 2 colunas e no histórico da Aba 2.
  - Formatação da data no padrão brasileiro `DD/MM/YYYY`.
  - Inserção automática de `createdAt` no momento exato em que novas pautas são geradas.

### 📅 07/11/2026 — 01:05: Layout em Grade Dupla (2 Colunas) & Paginação
* **O que foi feito:**
  - O último card gerado permanece como **⭐ Em Destaque** no topo direito.
  - A partir da 2ª pauta, os cards são distribuídos em uma **grade de 2 colunas** abaixo do gerador.
  - Paginação automática a cada 6 cards por página com navegação fluida e rolagem suave.

### 📅 07/11/2026 — 00:45: Ciclo Completo de Assinaturas, Webhook & Cancelamento Stripe
* **O que foi feito:**
  - Configuração do **Customer Portal da Stripe** com cancelamento imediato sem retenção.
  - Criação do Webhook `we_1UZ0jJR7gUI3kMGcjW67ArVo` no Stripe para eventos `customer.subscription.deleted`, `customer.subscription.updated` e `checkout.session.completed`.
  - Endpoint de cancelamento direto in-app `/api/checkout/cancel` e confirmação síncrona pós-checkout `/api/checkout/confirm`.
  - Reutilização do mesmo `stripe_customer_id` por e-mail para evitar duplicação de cadastros de clientes no Stripe.
  - Banner informativo pós-cancelamento na Aba 4 garantindo acesso total ao histórico gerado.

### 📅 07/11/2026 — 00:30: Ajuste de Navegação no Dashboard
* **O que foi feito:**
  - Clique na logo "Gera Pauta" ou no nome da empresa agora navega de volta para a Aba 1 ("1. Gerador") em vez de redirecionar para a Landing Page externa.

---

## 🚀 4. Status Atual das Entregas
* [x] Documento vivo com data, hora e mapeamento de estruturas criado.
* [x] Expansão dos campos de contexto da marca (Diferencial, Carro-Chefe, Diretrizes Negativas).
* [x] Modal e interface para Cadastrar, Editar e Excluir Personas na Aba 3.
* [x] Conexão em tempo real entre personas cadastradas e seletores da Aba 1 (Gerador).
* [x] Injeção dos novos campos estruturados no prompt da API `/api/generate` e `/api/refine`.
* [x] Validação TypeScript 100% sem erros.
