# 📝 Mark Tasks — Testes E2E com Playwright & TypeScript

[![Playwright Tests](https://img.shields.io/badge/Playwright-v1.62.1-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)

Repositório com uma aplicação completa de gerenciamento de tarefas (**Mark Tasks**) e uma suíte profissional de testes automatizados **End-to-End (E2E)** construída com **Playwright** e **TypeScript**, aplicando padrões arquiteturais avançados para automação de testes de alta confiabilidade.

---

## 🎯 Destaques e Boas Práticas da Automação

- **Page Object Model (POM)**: Estrutura desacoplada onde elementos e ações de tela ficam centralizados na classe `TasksPage`, aumentando a manutenibilidade e legibilidade dos testes.
- **Testes Híbridos (API + UI)**: Utilização do `APIRequestContext` do Playwright para preparar o estado do banco (exclusão e cadastro prévio de tarefas via API) antes da interação na interface web, garantindo independência e alta velocidade de execução.
- **Fixtures & Dados Tipados**: Separação clara de massa de dados em JSON (`tasks.json`) e tipagem com contratos TypeScript (`TaskModel`).
- **Execução Paralela Multi-Browser & Responsiva**: Testes executados simultaneamente em navegadores desktop (**Chromium, Firefox, WebKit/Safari**) e emuladores mobile (**Mobile Chrome / Pixel 5**, **Mobile Safari / iPhone 12**).
- **Observabilidade Completa**: Captura automática de screenshots em caso de falhas (`only-on-failure`), gravação de traces para debug (`on-first-retry`) e relatórios interativos em HTML.
- **Gerenciamento de Ambientes**: Variáveis de ambiente centralizadas com `dotenv` e URLs parametrizáveis.

---

## 📁 Estrutura do Repositório

```text
udemy-playwright-express/
├── app/
│   ├── api/                    # Backend Node.js (Express + TypeORM + SQLite) - Porta 3333
│   │   ├── src/                # Controllers, Models, Migrations e Servidor
│   │   └── ormconfig.json      # Configuração do banco de dados SQLite
│   └── web/                    # Frontend Web (HTML5/CSS3/Vanilla JS) - Porta 8080
│       ├── assets/             # Estilos, scripts e imagens da interface
│       └── index.html          # Página principal da aplicação
├── tests/                      # Suíte de Testes Automatizados E2E
│   ├── fixtures/               # Massas de dados e modelos TypeScript
│   │   ├── task.model.ts       # Interface TypeScript da entidade Task
│   │   └── tasks.json          # Payloads e massas para cenários de teste
│   ├── support/                # Utilitários, Helpers e Page Objects
│   │   ├── helpers.ts          # Helpers de API (deleteTaskByHelper, postTask)
│   │   └── pages/tasks/index.ts # Page Object da página de tarefas
│   ├── home.spec.ts            # Teste de disponibilidade do WebApp
│   └── tasks.spec.ts           # Cenários de cadastro, duplicidade, campos obrigatórios, toggle e exclusão
├── .env.example                # Modelo de variáveis de ambiente
├── playwright.config.ts        # Configuração global do Playwright (browsers, timeouts, reporters)
├── tsconfig.json               # Configurações do compilador TypeScript
├── Insomnia_markL.json         # Workspace exportado do Insomnia para testes manuais de API
├── Guia_de_Estudos_udemy_playwright_express.pdf # Guia complementar de estudos do curso
└── package.json                # Dependências raiz e scripts de execução
```

---

## 🧪 Cenários de Teste Automatizados

| Especificação | Cenário | Descrição |
| :--- | :--- | :--- |
| `home.spec.ts` | **Webapp online** | Valida se a aplicação web está acessível e com o título esperado. |
| `tasks.spec.ts` | **Cadastro com sucesso** | Cadastra uma nova tarefa na UI e valida a exibição no grid. |
| `tasks.spec.ts` | **Validação de duplicidade** | Garante que o sistema exibe alerta ao tentar cadastrar tarefa com nome já existente. |
| `tasks.spec.ts` | **Campo obrigatório** | Valida a mensagem nativa de validação HTML5 quando o campo de tarefa está vazio. |
| `tasks.spec.ts` | **Concluir tarefa (Toggle)** | Cria a tarefa via API, marca como concluída na UI e valida o estilo riscado. |
| `tasks.spec.ts` | **Exclusão de tarefa** | Cria a tarefa via API, clica no botão de exclusão na UI e valida a remoção da lista. |

---

## ⚙️ Pré-requisitos

Certifique-se de possuir em seu ambiente:
- **Node.js**: `v18.x` ou superior (testado também no Node.js v24+)
- **npm** ou **yarn**: Gerenciador de pacotes do Node.js
- **Navegadores do Playwright**: Instalados automaticamente via CLI

---

## 🚀 Guia de Instalação e Execução

### 1. Clonar o Repositório & Configurar o Ambiente

```bash
# Clone o repositório
git clone https://github.com/lfernandobra/udemy-playwright-express.git
cd udemy-playwright-express

# Crie o arquivo .env a partir do exemplo
cp .env.example .env
```

Conteúdo padrão do `.env`:
```env
BASE_URL=http://localhost:8080
BASE_API=http://localhost:3333
```

---

### 2. Iniciar a API (Backend)

Em um terminal:

```bash
cd app/api

# Instalar dependências da API
npm install

# Inicializar o banco de dados SQLite (executa migrations)
npm run db:init

# Iniciar o servidor da API
npm run dev
```
> 📍 **API Backend**: `http://localhost:3333`

---

### 3. Iniciar a Interface Web (Frontend)

Em um **segundo terminal**:

```bash
cd app/web

# Instalar dependências do Web
npm install

# Iniciar o servidor HTTP
npm run dev
```
> 📍 **Frontend Web**: `http://localhost:8080`

---

### 4. Instalar e Executar os Testes (Playwright)

Em um **terceiro terminal** na raiz do projeto:

```bash
# Instalar as dependências da raiz
npm install

# Instalar os binários dos navegadores do Playwright (primeira vez)
npx playwright install
```

#### Comandos de Execução dos Testes:

```bash
# Executa todos os testes em modo headless (Chromium, Firefox, WebKit, Mobile)
npm test

# Executa com a interface gráfica interativa do Playwright (UI Mode - Recomendado)
npm run test:ui

# Executa com o navegador visível (Headed Mode)
npm run test:headed

# Executa em modo Debug passo a passo (Playwright Inspector)
npm run test:debug

# Abre o relatório HTML detalhado da última execução
npm run test:report
```

---

## 🛠️ Scripts NPM Disponíveis

### Raiz do Projeto (Testes E2E)
| Script | Comando | Descrição |
| :--- | :--- | :--- |
| `npm test` | `playwright test` | Executa todos os testes E2E em modo headless. |
| `npm run test:ui` | `playwright test --ui` | Abre a interface interativa do Playwright para execução e depuração visual. |
| `npm run test:headed` | `playwright test --headed` | Executa os testes abrindo as janelas dos navegadores. |
| `npm run test:debug` | `playwright test --debug` | Executa no modo debug com o Playwright Inspector. |
| `npm run test:report` | `playwright show-report` | Abre o relatório interativo HTML da última execução. |

### API (`app/api`)
| Script | Comando | Descrição |
| :--- | :--- | :--- |
| `npm run dev` | `ts-node-dev src/server.ts` | Inicia a API com recarregamento automático (hot-reload). |
| `npm run db:init` | `typeorm migration:run` | Executa as migrações e cria o banco SQLite local. |
| `npm run db:drop` | `typeorm schema:drop` | Limpa todo o schema e dados do banco SQLite. |

### Web (`app/web`)
| Script | Comando | Descrição |
| :--- | :--- | :--- |
| `npm run dev` | `http-server . -p 8080` | Servidor web estático na porta 8080 com CORS habilitado. |

---

## 💡 Solução de Problemas & Dicas

- **Erro de compilação do `better-sqlite3`**: Em versões recentes do Node.js (v20+ / v22+ / v24+), caso o `npm run db:init` apresente erro de bindings nativos, execute na pasta `app/api`:
  ```bash
  cd app/api && npm install better-sqlite3@latest
  ```
- **Portas em uso (3333 ou 8080)**: Certifique-se de que nenhuma outra aplicação está ocupando as portas 3333 ou 8080 antes de iniciar os servidores.
- **Silenciar avisos de injeção de ambiente (`dotenv`/`dotenvx`)**: A configuração do `playwright.config.ts` já possui `quiet: true` habilitado para manter os logs de teste limpos durante a execução dos workers paralelos.

---

## 📚 Recursos Adicionais

- **[Insomnia_markL.json](./Insomnia_markL.json)**: Coleção pronta para importar no Insomnia e testar os endpoints da API (`POST /tasks`, `GET /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`).
- **[Guia_de_Estudos_udemy_playwright_express.pdf](./Guia_de_Estudos_udemy_playwright_express.pdf)**: Guia completo em PDF com resumos e conceitos fundamentais do curso.

---

## 👨‍💻 Autor

Desenvolvido por **Luis Fernando Brandão durante a formação em automação de testes com Playwright.
