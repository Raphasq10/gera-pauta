# 🧪 Roteiro de Testes Manuais — Feature 4: Controle de Quota Gratuita (5 Pautas Grátis)

Este documento orienta o aluno/designer a testar passo a passo a mecânica de paywall, proteção de quota no servidor e o modal de planos.

---

## 📋 Pré-requisitos
1. Servidor de desenvolvimento em execução (`http://localhost:3000`).
2. Estar logado com sua conta no Dashboard (`http://localhost:3000/dashboard`).

---

## 🎯 Caso de Teste 1: Caminho Feliz (Saldo Inicial de Degustação)

### 📌 Objetivo
Comprovar que um usuário recém-cadastrado tem direito a 5 pautas gratuitas.

### 👣 Passo a Passo:
1. Acesse o Dashboard em `http://localhost:3000/dashboard`.
2. Observe o canto superior direito do cabeçalho.
3. **Resultado Esperado:**
   - O indicador de degustação exibe: `5 / 5 restantes` (ou a quantidade restante com base nas suas gerações anteriores).
   - O botão "Gerar Pautas Estruturadas" está habilitado.

---

## 📉 Caso de Teste 2: Consumo Gradual e Sincronização

### 👣 Passo a Passo:
1. No gerador de pautas, selecione gerar um lote de pautas.
2. Clique em **"Gerar Pautas Estruturadas"**.
3. **Resultado Esperado:**
   - As pautas são geradas com sucesso.
   - O contador de quota no topo atualiza automaticamente subtraindo as pautas geradas (ex: de 5 para 2).
   - O banco de dados Supabase (`profiles.used_pitches`) é atualizado atomicamente no servidor.

---

## 🚫 Caso de Teste 3: Bloqueio Seguro no Servidor (Paywall na 6ª Pauta)

### 📌 Objetivo
Comprovar que, ao atingir o limite de 5 pautas no plano gratuito, o backend bloqueia a geração com HTTP 403.

### 👣 Passo a Passo:
1. Com o saldo esgotado (`0 / 5 restantes`), tente clicar novamente em **"Gerar Pautas Estruturadas"**.
2. **Resultado Esperado:**
   - A requisição para `/api/generate` é rejeitada pelo servidor com status **`403 Forbidden`** e código `QUOTA_EXCEEDED`.
   - Um aviso amigável em toast vermelho aparece: *"Você atingiu o limite de 5 pautas gratuitas! Faça upgrade para o Plano Pro ou conecte sua chave de IA."*.
   - Nenhuma pauta adicional é gerada ou salva indevidamente.

---

## 💎 Caso de Teste 4: Abertura do Modal de Planos (Critério do PRD)

### 📌 Objetivo
Validar que a tela de contratação de planos é apresentada automaticamente ao atingir o teto de gratuidade.

### 👣 Passo a Passo:
1. Ao estourar o limite de 5 pautas, observe a tela.
2. **Resultado Esperado:**
   - O modal **"Degustação de 5 Pautas Concluída! 🎉"** abre automaticamente.
   - O modal apresenta de forma clara e elegante:
     1. **Plano PRO Ilimitado:** R$ 47/mês com botão de contratação.
     2. **Chave de IA Própria (BYOK):** Opção gratuita conectando o Google AI Studio.
     3. **Botão de Modo Desenvolvedor:** Link discreto para restaurar o saldo durante os testes.

---

## 🛡️ Caso de Teste 5: Prevenção de Race Conditions & Bypass

### 1. Duplo Clique Rápido (Race Condition)
- **Ação:** No momento em que você tem apenas 1 crédito restante, dê dois cliques muito rápidos no botão "Gerar".
- **Resultado Esperado:** O estado `isGenerating` desabilita o botão imediatamente no primeiro clique. Apenas uma requisição é enviada, impedindo que você gere 2 vezes com saldo de 1.

### 2. Tentativa de Bypass no Inspecionar Elemento (Segurança de Backend)
- **Ação:** Mesmo que um usuário mal-intencionado edite o JavaScript do navegador para tentar disparar um `fetch('/api/generate')` via console com cota estourada, o servidor no Next.js consulta o Supabase e bloqueia com `403 Forbidden`. A segurança nunca depende apenas do navegador!

---

## 🔄 Caso de Teste 6: Restauração de Saldo para Testes

### 👣 Passo a Passo:
1. No cabeçalho, clique no link **`(Resetar)`** ao lado do contador de quota ou no modal de planos.
2. **Resultado Esperado:**
   - A API `/api/quota` processa a limpeza segura da cota.
   - O toast confirma: *"✨ Saldo de degustação restaurado (5 pautas liberadas) para você continuar testando!"*.
   - O modal se fecha e você pode gerar novos lotes livremente.
