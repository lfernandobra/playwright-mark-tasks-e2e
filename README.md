# Mark - Gerenciador de Tarefas (API, Web & Testes E2E com Playwright)

Este repositório contém uma aplicação completa de gerenciamento de tarefas ("Mark") desenvolvida para estudo e prática de automação de testes End-to-End (E2E) com **Playwright**.

---

## 📁 Estrutura do Projeto

```text
udemy-playwright-express/
├── app/
│   ├── api/       # Backend Node.js (Express + TypeORM + SQLite) - Porta 3333
│   └── web/       # Frontend Web (Interface gráfica servida com http-server) - Porta 8080
├── tests/         # Suíte de testes automatizados E2E com Playwright
├── playwright.config.ts
└── package.json   # Dependências raiz do Playwright
```

---

## ⚙️ Pré-requisitos

Antes de começar, garante que tens instalado na tua máquina:

- **Node.js**: versão `v18.x` ou superior (testado com Node.js v24)
- **npm**: gerenciador de pacotes padrão do Node.js

---

## 🚀 Guia de Instalação e Execução

Siga os passos abaixo para configurar e rodar o projeto localmente:

### 1. Clonar o repositório & Acessar o diretório

```bash
cd /Users/lfernandobra/Documents/GitHub/udemy-playwright-express
```

---

### 2. Configurar e Iniciar a API (Backend)

A API gerencia a persistência das tarefas utilizando SQLite e TypeORM na porta `3333`.

1. Acesse o diretório da API:

   ```bash
   cd app/api
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicialize o banco de dados SQLite (executa as migrações do TypeORM):

   ```bash
   npm run db:init
   ```

4. Inicie o servidor da API em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   > A API estará rodando em: `http://localhost:3333`

---

### 3. Configurar e Iniciar a Interface Web (Frontend)

O Frontend é a interface gráfica onde as tarefas são visualizadas e gerenciadas na porta `8080`.

1. Em um novo terminal, acesse o diretório web:

   ```bash
   cd app/web
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor web:
   ```bash
   npm run dev
   ```
   > O Frontend estará acessível em: `http://localhost:8080`

---

### 4. Configurar e Executar os Testes Automatizados (Playwright)

Com a API e o Web rodando, abra um novo terminal na **raiz do projeto** para rodar a suíte de testes E2E.

1. Instale as dependências da raiz (Playwright):

   ```bash
   npm install
   ```

2. Instale os navegadores do Playwright (Chromium, Firefox, WebKit):

   ```bash
   npx playwright install
   ```

3. Executar os testes em modo headless:

   ```bash
   npx playwright test
   ```

4. Executar os testes com a Interface Gráfica interativa do Playwright (UI Mode):

   ```bash
   npx playwright test --ui
   ```

5. Visualizar o relatório de testes (HTML Report):
   ```bash
   npx playwright show-report
   ```

---

## 🛠️ Scripts Úteis

### API (`app/api`)

- `npm run dev` - Inicia a API na porta 3333.
- `npm run db:init` - Roda as migrations do banco de dados SQLite.
- `npm run db:drop` - Apaga/reseta o schema do banco de dados.

### Web (`app/web`)

- `npm run dev` ou `npm start` - Servidor HTTP estático na porta 8080.

---

## 💡 Observações & Solução de Problemas

- **Erro de Bindings do `better-sqlite3`**: Se ao rodar `npm run db:init` você receber um erro referente ao `better-sqlite3`, certifique-se de que instalou a versão compatível com a versão do Node.js em uso rodando `npm install better-sqlite3@latest` na pasta `app/api`.

## Modo debug

- `yarn playwright test --debug` executa no modo debug
