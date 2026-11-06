# 🧪 Guia de Testes Manuais — Feature 1: Autenticação & Gestão de Conta

Este documento foi criado para você testar a feature de **Autenticação (Supabase Auth)** de forma prática, entendendo o que cada teste valida por baixo dos panos.

---

## 🎯 1. Caminho Feliz (Happy Path)

O objetivo é verificar se o fluxo normal de um usuário comum funciona sem fricção.

### Teste 1.1: Criar uma Nova Conta
1. Abra o navegador em: [http://localhost:3000/login](http://localhost:3000/login)
2. Clique no link **"Cadastre-se grátis"**
3. Preencha os campos:
   - **Nome da Empresa:** `Pizzaria Di Fiori`
   - **E-mail:** `teste.aluno@gerapauta.com` (ou qualquer e-mail com formato válido)
   - **Senha:** `123456`
4. Clique no botão **"Criar Minha Conta Grátis"**
5. **Resultado Esperado:** 
   - Notificação verde: *"Conta criada com sucesso! Bem-vindo(a) ao Gera Pauta."*
   - Redirecionamento automático para a tela `/onboarding`.

### Teste 1.2: Fazer Login com a Conta Criada
1. Se estiver no dashboard ou onboarding, deslogue ou abra uma aba anônima.
2. Acesse: [http://localhost:3000/login](http://localhost:3000/login)
3. Digite o e-mail e a senha cadastrados.
4. Clique em **"Entrar na Plataforma"**.
5. **Resultado Esperado:**
   - Notificação verde: *"Login realizado com sucesso!"*
   - Redirecionamento para o `/dashboard`.

### Teste 1.3: Logout (Sair da Conta)
1. No topo direito do `/dashboard`, clique no botão **"Sair da Conta"** (com ícone de porta/logout).
2. **Resultado Esperado:**
   - Notificação: *"Você saiu da sua conta."*
   - Redirecionamento de volta para `/login`.

---

## 🛑 2. Testes de Inputs Inválidos (Validação com Zod)

O objetivo é garantir que dados ruins sejam barrados antes de quebrar o sistema.

### Teste 2.1: E-mail em formato inválido
- Digite `aluno_sem_arroba` no campo de e-mail e clique em entrar.
- **Resultado Esperado:** O Zod deve exibir em vermelho: *"Formato de e-mail inválido. Ex: nome@empresa.com"*, impedindo o envio da requisição.

### Teste 2.2: Senha muito curta
- Digite uma senha de 3 caracteres (`123`).
- **Resultado Esperado:** O formulário deve exibir: *"A senha deve ter no mínimo 6 caracteres."*.

### Teste 2.3: Limite de caracteres (Anti-DoS)
- Tente digitar mais de 255 caracteres no campo de e-mail.
- **Resultado Esperado:** O campo possui `maxLength={255}` no HTML e o Zod valida no servidor, impedindo que o navegador trave ou envie payloads gigantes.

---

## 🛡️ 3. Tentativa de Injeção de Código (XSS - Cross-Site Scripting)

O objetivo é testar se o sistema é vulnerável a código malicioso injetado por usuários.

1. No campo de cadastro **"Nome da sua Empresa"**, digite exatamente:
   ```html
   <script>alert('Ataque XSS!');</script>
   ```
2. Digite um e-mail novo e senha e envie.
3. Acesse o `/dashboard` e veja onde o nome da empresa aparece.
4. **Resultado Esperado:** 
   - O navegador deve exibir o texto puro literal: `<script>alert('Ataque XSS!');</script>`.
   - **NENHUM alerta pop-up deve disparar**, comprovando que o React e nossa sanitização neutralizaram o código.

---

## ⚡ 4. Proteção contra Clique Duplo (Race Conditions / Double-Submit)

O objetivo é garantir que cliques rápidos repetidos não disparem duas criações de conta simultâneas.

1. Preencha o formulário de login ou cadastro.
2. Clique no botão de submissão **duas ou três vezes bem rápido**.
3. **Resultado Esperado:**
   - No primeiro milissegundo do clique, o botão é desabilitado (`disabled={isSubmitting}`).
   - O texto muda para um ícone giratório com aviso (*"Verificando credenciais..."* ou *"Criando sua conta..."*).
   - Apenas uma única requisição é enviada ao servidor.

---

## 🔒 5. Proteção de Rotas com Middleware (Sessão JWT)

O objetivo é garantir que visitantes não autenticados não consigam acessar páginas privadas.

1. Abra uma **janela anônima** (onde você não tem login salvo).
2. Tente acessar diretamente na barra de endereço:
   - `http://localhost:3000/dashboard`
   - `http://localhost:3000/onboarding`
3. **Resultado Esperado:**
   - O `src/middleware.ts` intercepta o acesso imediatamente no servidor.
   - Você é redirecionado para `http://localhost:3000/login?redirect=/dashboard`.

---

## 🐌 6. Simulação de Conexão Lenta (Loading State)

1. No Chrome, abra as Ferramentas do Desenvolvedor (`F12`).
2. Vá até a aba **Network (Rede)**.
3. No seletor de velocidade (onde está "No throttling"), mude para **"Slow 3G"**.
4. Clique em "Entrar".
5. **Resultado Esperado:** O botão permanece desabilitado com o spinner girando sem quebrar o layout até a resposta voltar.
