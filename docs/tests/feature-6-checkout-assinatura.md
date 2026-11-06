# 🧪 Roteiro de Testes Manuais — Feature 6: Checkout & Assinatura de Planos (Stripe / Asaas)

Este documento foi criado para orientar o aluno/designer nos testes de ponta a ponta do fluxo de contratação de planos, checkout seguro, webhook e ativação automática do status PRO.

---

## 📋 Pré-requisitos
1. Servidor de desenvolvimento rodando (`http://localhost:3000`).
2. Estar logado com uma conta no sistema.
3. Acessar `http://localhost:3000/planos` ou a aba **"4. Planos & IA"** do Dashboard.

---

## 🎯 Caso de Teste 1: Caminho Feliz (Página de Planos & Checkout Transparente)

### 📌 Objetivo
Comprovar que o usuário consegue visualizar os planos, alternar entre faturamento mensal e anual, e iniciar o checkout seguro.

### 👣 Passo a Passo:
1. Acesse `http://localhost:3000/planos`.
2. Teste o toggle **"Faturamento Mensal"** e **"Faturamento Anual (17% OFF)"**:
   - Observe os preços se ajustando em tempo real (R$ 47/mês vs R$ 39/mês).
3. No card do **Plano PRO**, clique no botão **"Assinar Plano PRO Agora"**.
4. **Resultado Esperado:**
   - O botão entra em loading (*"Conectando ao Checkout Seguro..."*) e fica desabilitado para evitar duplo clique (race condition).
   - O sistema aciona a API `/api/checkout`.
   - Você é redirecionado para a página de confirmação segura: `http://localhost:3000/checkout/success`.

---

## 🎉 Caso de Teste 2: Confirmação Imediata & Ativação do Status PRO

### 👣 Passo a Passo:
1. Na tela `/checkout/success`:
   - Observe a celebração de ativação do Plano PRO com resumo dos benefícios liberados.
2. Clique no botão **"Ir para o Dashboard e Criar Pautas"**.
3. No Dashboard:
   - Observe o cabeçalho superior: o botão *"Fazer Upgrade PRO"* agora foi substituído pelo badge dourado:  
     **`👑 PRO Ilimitado`**.
   - Na aba **1. Gerador**, gere um novo lote de pautas.
4. **Resultado Esperado:**
   - As pautas são geradas normalmente sem nenhum bloqueio de cota de 5 pautas!
   - O banco de dados Supabase (`profiles.is_pro`) está marcado como `true`.

---

## 🛑 Caso de Teste 3: Cancelamento de Checkout

### 👣 Passo a Passo:
1. Acesse diretamente `http://localhost:3000/checkout/cancel`.
2. **Resultado Esperado:**
   - A tela exibe de forma acolhedora: *"Assinatura não concluída — Nenhuma cobrança foi realizada no seu cartão"*.
   - Botão para voltar em segurança para o Dashboard sem perda de estado.

---

## 🛡️ Caso de Teste 4: Segurança, Zod & Prevenção de Open Redirect

### 1. Prevenção de Injeção de Links Perigosos (XSS & Open Redirect)
- **Cenário:** Um invasor tenta disparar um checkout enviando um `successUrl` com protocolo malicioso (`javascript:alert(1)`).
- **Ação:** O schema Zod (`CreateCheckoutSessionSchema`) valida que qualquer URL enviada precisa ser estritamente uma URL HTTP/HTTPS válida.
- **Resultado Esperado:** O servidor rejeita a requisição com HTTP `400 Bad Request`.

### 2. Prevenção de Race Conditions (Duplo Clique no Checkout)
- **Cenário:** O usuário com internet lenta clica duas vezes rapidamente no botão de assinar.
- **Resultado Esperado:** O estado `isLoadingCheckout = true` desabilita o botão no primeiro clique, impedindo que sejam criadas duas sessões de cobrança simultâneas.

---

## 🪝 Caso de Teste 5: Webhook de Pagamento Assíncrono (`/api/webhook/stripe`)

### 📌 Objetivo
Comprovar que o webhook oficial processa confirmações de pagamento da Stripe com validação criptográfica.

### 👣 Passo a Passo:
1. O endpoint `/api/webhook/stripe` está ouvindo requisições POST.
2. Quando a Stripe envia o evento `checkout.session.completed` ou `invoice.payment_succeeded`, o webhook verifica a assinatura com o `STRIPE_WEBHOOK_SECRET`.
3. Ao validar a assinatura, o backend atualiza o perfil do usuário correspondente (`is_pro: true`).
4. Se o usuário cancelar a assinatura no portal da Stripe (`customer.subscription.deleted`), o webhook revoga o status (`is_pro: false`).
