# 🧪 Guia de Testes Manuais — Feature 2: Onboarding de Contexto do Negócio

Este documento guia o teste prático da **Feature 2: Setup do Perfil/Cliente e Memória de Marca**.

---

## 🎯 1. Caminho Feliz (Happy Path)

### Teste 1.1: Preencher o Onboarding em 3 Passos
1. Faça login na sua conta ou acesse diretamente: [http://localhost:3000/onboarding](http://localhost:3000/onboarding)
2. **Passo 1 (Empresa & Nicho):**
   - Nome da Marca: `Capi Webcraft`
   - Nicho: Clique no chip `+ Desenvolvimento Web & Design` ou digite.
   - Clique em **"Avançar ➔"**.
3. **Passo 2 (Público-Alvo & Dor):**
   - Público-Alvo: `Empreendedores e profissionais que precisam de site de alta conversão`
   - Dor/Objeção: `Trauma com freelancers que atrasam e sites amadores que não vendem`
   - Clique em **"Avançar ➔"**.
4. **Passo 3 (Tom de Voz & Diferencial):**
   - Tom de Voz: Clique no chip `+ Direto, moderno e inovador`.
   - Diferencial: `Entrega em 7 dias com design exclusivo e foco em conversão no WhatsApp`
   - Clique em **"Salvar Perfil & Ir ao Gerador"**.
5. **Resultado Esperado:**
   - Notificação verde: *"Memória de marca salva com sucesso! Abrindo seu gerador..."*
   - Redirecionamento automático para o `/dashboard`.
   - No topo do dashboard, o nome `Capi Webcraft` e o nicho `Desenvolvimento Web & Design` aparecem carregados automaticamente.

---

## 🤖 2. Injeção Automática no Motor de IA (Critério 2 do PRD)

### Teste 2.1: Gerar Pautas Personalizadas com a Marca
1. No `/dashboard`, vá na aba **"Gerador de Pautas"**.
2. Deixe o campo de ideia inicial em branco ou digite um tema rápido (ex: `Lançamento do novo site`).
3. Clique no botão dourado **"Gerar Pautas com IA"**.
4. **Resultado Esperado:**
   - A IA gera pautas citando a sua empresa (`Capi Webcraft`), o seu nicho (`Desenvolvimento Web`), quebrando a dor configurada (`medo de atraso e sites amadores`) e destacando o diferencial (`entrega em 7 dias`).
   - As headlines e legendas vêm no tom configurado (`Direto, moderno e inovador`).

---

## 🛑 3. Validação de Inputs Inválidos (Zod no Cliente e Servidor)

### Teste 3.1: Campos Vazios no Passo 1
1. No Passo 1, apague o nome da empresa e o nicho.
2. Tente clicar em **"Avançar"**.
3. **Resultado Esperado:** O avanço é bloqueado. Mensagens em vermelho aparecem: *"O nome da empresa deve ter pelo menos 2 caracteres."* e toast de aviso: *"Por favor, preencha os campos obrigatórios deste passo."*.

### Teste 3.2: Limites de Tamanho (Anti-DoS)
1. Tente colar um texto de mais de 100 caracteres no nome da empresa.
2. **Resultado Esperado:** O input possui `maxLength={100}` e corta o excesso automaticamente.

---

## 🛡️ 4. Tentativa de Injeção de Código (XSS - Cross-Site Scripting)

1. No campo de Diferencial Competitivo, cole exatamente:
   ```html
   <img src="x" onerror="alert('XSS');" />
   ```
2. Conclua o onboarding.
3. No dashboard, verifique onde o diferencial é exibido (aba "Meu Negócio").
4. **Resultado Esperado:**
   - O React renderiza a tag como texto puro seguro.
   - **Nenhum alerta JavaScript dispara na tela.**

---

## ⚡ 5. Proteção contra Race Condition (Double-Submit)

1. No Passo 3, clique no botão **"Salvar Perfil & Ir ao Gerador"** rapidamente 2 vezes seguidas.
2. **Resultado Esperado:**
   - No primeiro milissegundo, o botão fica desabilitado (`disabled={isSubmitting}`).
   - O botão exibe um spinner giratório: *"Salvando Memória de Marca..."*.
   - Apenas uma requisição é enviada ao backend.
