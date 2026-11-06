# 🧪 Roteiro de Testes Manuais — Feature 3: Motor de Pautas Contextualizadas & Multicanal

Este documento serve como guia prático e didático para testar todas as funcionalidades, validações e defesas de segurança implementadas na **Feature 3**.

---

## 📋 Pré-requisitos
1. Servidor de desenvolvimento em execução (`http://localhost:3000`).
2. Estar logado na aplicação e com o perfil de negócio configurado.
3. Acessar o Dashboard em `http://localhost:3000/dashboard`.

---

## 🎯 Caso de Teste 1: Caminho Feliz (Geração Multicanal Estruturada)

### 📌 Objetivo
Comprovar que o motor gera pautas completas para cada um dos canais com os 4 blocos obrigatórios e 2 opções de headline.

### 👣 Passo a Passo:
1. No painel à esquerda do Dashboard:
   - Selecione a persona desejada.
   - Selecione o canal **Instagram**.
   - Defina o objetivo: **"📲 Chamar no WhatsApp / Agendamento Direto"**.
   - Mantenha os toggles **"Incluir Emojis"** e **"Hashtags do Nicho"** ligados.
   - Deixe o campo de briefing vazio (ideação automática com base na dor da persona).
2. Clique no botão **"Gerar Pautas Estruturadas"**.
3. **Resultado Esperado:**
   - O botão entra em loading (*"Escrevendo com IA contextualizada..."*) e fica desabilitado.
   - São gerados cards de pauta no painel direito.
   - Cada card contém obrigatoriamente:
     - **Bloco 1:** Mote Estratégico em 1 linha.
     - **Bloco 2:** Duas opções de Headline da Arte (Opção 1: Pergunta Provocativa / Gancho de Curiosidade; Opção 2: Afirmação de Impacto / Posicionamento de Autoridade).
     - **Bloco 3:** Legenda Completa formatada com CTA específico para WhatsApp.
     - **Bloco 4:** Formato Recomendado e justificativa estratégica.
   - Badge indicando o canal `INSTAGRAM`.

---

## 📱 Caso de Teste 2: Adaptação Automática de Tom por Canal

### 👣 Passo a Passo:
1. **Teste WhatsApp:**
   - Troque o canal para **WhatsApp**.
   - Clique em **"Gerar Pautas Estruturadas"**.
   - *Verifique:* A legenda vem formatada como mensagem direta, com marcação em `*negrito*` para leitura rápida no WhatsApp.
2. **Teste TikTok / Reels:**
   - Troque o canal para **TikTok / Reels**.
   - Clique em **"Gerar Pautas Estruturadas"**.
   - *Verifique:* A legenda inclui um roteiro dinâmico dividido em 3 cenas cronometradas (Cena 1 Gancho 0-3s, Cena 2 Conteúdo 3-15s, Cena 3 CTA 15-20s).
3. **Teste LinkedIn:**
   - Troque o canal para **LinkedIn**.
   - *Verifique:* O texto ganha postura executiva, reflexão de mercado e apelo profissional.

---

## ⚡ Caso de Teste 3: Toggles de Emojis e Hashtags em Tempo Real

### 📌 Objetivo
Validar que os switches de Emojis e Hashtags atuam instantaneamente na tela e na cópia, sem precisar recarregar a página.

### 👣 Passo a Passo:
1. Com uma pauta já gerada na tela, desmarque o checkbox **"Incluir Emojis"**.
2. **Resultado Esperado:**
   - Os emojis da legenda somem imediatamente no card.
   - Ao clicar em **"Copiar Legenda"** ou **"Copiar Pauta Completa"**, o texto colado no bloco de notas estará 100% limpo, sem nenhum emoji.
3. Agora desmarque o checkbox **"Hashtags do Nicho"**.
4. **Resultado Esperado:**
   - O bloco final de hashtags (`#Nicho #Empresa`) é removido instantaneamente da exibição e da área de transferência.
5. Marque ambos novamente e veja os elementos retornarem.

---

## 📋 Caso de Teste 4: Botões de Cópia Individual com Feedback Visual

### 👣 Passo a Passo:
1. No card da pauta:
   - Clique em **"Copiar Mote"** → Notificação visual (toast): *"Mote Estratégico copiado com sucesso!"*.
   - Clique em **"Copiar"** ao lado da Opção 1 da Headline → Toast: *"Opção 1 da Headline copiado com sucesso!"*.
   - Clique em **"Copiar"** ao lado da Opção 2 da Headline → Toast: *"Opção 2 da Headline copiado com sucesso!"*.
   - Clique em **"Copiar Legenda"** → Toast: *"Legenda Completa copiado com sucesso!"*.
   - Clique em **"Copiar Pauta Completa"** → O botão muda para *"Copiado!"* com ícone verde `Check` por 2,5 segundos e emite toast de sucesso.
2. Abra o Bloco de Notas e cole (`Ctrl + V`).
3. **Resultado Esperado:** Todo o conteúdo é colado de forma organizada com títulos em seções legíveis.

---

## 🪄 Caso de Teste 5: Refazer / Ajustar Pauta Individual (Instrução Livre)

### 📌 Objetivo
Validar o motor de refinamento contextualizado via `/api/refine` e o versionamento incremental (`v1` → `v2`).

### 👣 Passo a Passo:
1. Em qualquer card de pauta, clique no botão **"Refazer / Ajustar"** no rodapé do card.
2. O painel inline de ajuste com IA se expande.
3. Teste os chips rápidos de instrução (ex: clique em *"🔥 Mais persuasivo para WhatsApp"* ou digite: *"Troque a chamada para ação para agendamento de quinta-feira"*).
4. Clique em **"Aplicar Ajuste"**.
5. **Resultado Esperado:**
   - O botão entra em loading (*"Ajustando com IA..."*) com spinner giratório.
   - O card é reescrito pontualmente atendendo à instrução.
   - O cabeçalho do card exibe a badge dourada: `v2 (Ajustada)`.
   - Toast informativo: *"Pauta ajustada com sucesso para a versão v2!"*.
   - As demais pautas geradas permanecem intactas, sem perda de contexto.

---

## 🛡️ Caso de Teste 6: Testes de Segurança & Resiliência

### 1. Prevenção de Injeção XSS
- **Ação:** No campo de briefing opcional ou no campo de instrução de ajuste, cole:
  `<script>alert("XSS")</script>`
- **Resultado Esperado:** O sistema aceita o texto, mas o React renderiza na tela como texto puro inofensivo. Nenhuma caixa de alerta deve ser executada no navegador.

### 2. Prevenção de Race Condition (Duplo Clique)
- **Ação:** Dê um clique duplo muito rápido no botão "Gerar Pautas Estruturadas" ou "Aplicar Ajuste".
- **Resultado Esperado:** O primeiro clique ativa o estado `disabled` (`isGenerating = true` / `isRefining = true`), impedindo disparos duplicados ou consumo dobrado de cotas de IA.

### 3. Validação Zod com Entradas Inválidas
- **Ação:** Tente disparar o ajuste com campo de instrução com apenas 1 ou 2 letras (ex: `"a"`).
- **Resultado Esperado:** O sistema bloqueia na hora com aviso em vermelho: *"Por favor, digite pelo menos 3 caracteres indicando o que deseja ajustar."*.
