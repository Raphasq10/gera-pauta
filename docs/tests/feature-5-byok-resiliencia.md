# 🧪 Roteiro de Testes Manuais — Feature 5: Potencializador com Chave de IA do Usuário (BYOK) & Resiliência

Este guia didático foi preparado para que o aluno/designer teste e comprove o funcionamento do potencializador de chave própria de IA e a arquitetura de resiliência multinível.

---

## 📋 Pré-requisitos
1. Servidor de desenvolvimento ativo (`http://localhost:3000`).
2. Estar logado no Dashboard e acessar a aba **"4. Planos & IA"** (`http://localhost:3000/dashboard`).

---

## 🎯 Caso de Teste 1: Caminho Feliz (Teste com 1 Clique & Salvamento Criptografado)

### 📌 Objetivo
Comprovar que o usuário consegue testar a conexão com o Google AI Studio e salvar a chave com segurança.

### 👣 Passo a Passo:
1. Acesse o Dashboard e clique na aba **"4. Planos & IA"**.
2. No card *"Potencializador com Chave Própria (BYOK)"*:
   - Cole uma chave de teste válida do Google Gemini (iniciada com `AIzaSy...`).
   - Clique no ícone de olhinho 👁️ para alternar entre ver e ocultar a chave digitada.
3. Clique no botão **"⚡ Testar Conexão"**.
4. **Resultado Esperado:**
   - O botão exibe um spinner giratório (*"Testando..."*) e fica temporariamente desabilitado (prevenção de race condition).
   - Um alerta verde surge na tela indicando sucesso:
     *`Chave validada com sucesso! Resposta do Google AI Studio em Xms via modelo gemini-2.5-flash.`*
   - Toast verde confirmando a conexão.
5. Em seguida, clique no botão **"Salvar Chave"**.
6. **Resultado Esperado:**
   - O status muda imediatamente para o badge verde: **`🟢 Conectada & Ilimitada`**.
   - O campo é limpo e exibe a chave mascarada (ex: `AIzaSy...1234`).
   - A chave foi salva no banco de dados Supabase com criptografia **AES-256** (nunca em texto puro).

---

## ❌ Caso de Teste 2: Validação Zod & Chave Inválida

### 👣 Passo a Passo:
1. **Teste Vazio ou Curto:**
   - Tente clicar em "Testar Conexão" com o campo vazio ou digitando apenas `"12345"`.
   - *Resultado Esperado:* O botão permanece desabilitado ou o sistema exibe aviso: *"A chave de API deve ter pelo menos 15 caracteres."*.
2. **Teste com Chave Falsa / Inexistente:**
   - Digite uma chave falsa com formato válido (ex: `AIzaSyFakeKeyInvalidTest99999999`).
   - Clique em **"Testar Conexão"**.
   - *Resultado Esperado:* A API do Google rejeita e a interface exibe aviso amigável em português:  
     *"Chave do Google Gemini inválida. Verifique os caracteres e certifique-se de ter copiado a chave correta no Google AI Studio."*

---

## 🛡️ Caso de Teste 3: Tentativa de XSS & Caracteres Especiais

### 👣 Passo a Passo:
1. Tente colar código malicioso no campo de chave de API:
   `<script>alert("XSS")</script>`
2. Clique em "Salvar Chave" ou tente submeter.
3. **Resultado Esperado:**
   - A validação com **Zod** rejeita imediatamente via Regex:  
     *"Formato de chave inválido. A chave do Google Gemini contém apenas letras, números, hífens e underlines."*
   - Nenhum código é executado no navegador.

---

## ⚡ Caso de Teste 4: Prevenção de Race Conditions (Duplo Clique)

### 👣 Passo a Passo:
1. Dê dois cliques rápidos seguidos no botão "Testar Conexão" ou "Salvar Chave".
2. **Resultado Esperado:**
   - O primeiro clique aciona `isTestingApiKey = true` / `isSavingApiKey = true`, desabilitando o botão no mesmo milissegundo.
   - Nenhuma chamada duplicada é enviada aos servidores da Google.

---

## 🔄 Caso de Teste 5: Arquitetura de Resiliência Multinível

### 📌 Objetivo
Comprovar que, mesmo se a chave do usuário falhar durante uma geração, o sistema **não trava** e utiliza a resiliência transparente.

### 👣 Passo a Passo:
1. Vá até a aba **1. Gerador**.
2. Clique em **"Gerar Pautas Estruturadas"**.
3. **Comportamento Interno do Motor (3 Níveis de Contingência):**
   - **Nível 1:** O backend tenta gerar usando a chave BYOK do usuário.
   - **Nível 2:** Se a chave do usuário der erro de cota ou falhar, o sistema ativa automaticamente a chave oficial do servidor.
   - **Nível 3:** Se o servidor estiver temporariamente sem internet, o motor criativo local gera as pautas contextualizadas offline.
4. **Resultado Esperado:** As pautas são entregues com sucesso e sem erros na tela para o usuário!

---

## 🗑️ Caso de Teste 6: Desconexão da Chave

### 👣 Passo a Passo:
1. Na aba **4. Planos & IA**, com uma chave conectada:
2. Clique no botão vermelho **"Desconectar (AIzaSy...1234)"**.
3. **Resultado Esperado:**
   - A chave é removida do perfil (`user_api_key = null`).
   - O status volta para **`⚪ Cota Padrão Ativa`**.
   - Toast informativo: *"Chave de IA desconectada com sucesso. O sistema voltará ao plano padrão."*.
