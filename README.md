# Mark Tasks — Automação E2E Web & API com Playwright e TypeScript

[![Mark Tasks E2E CI](https://github.com/lfernandobra/playwright-mark-tasks-e2e/actions/workflows/ci.yml/badge.svg)](https://github.com/lfernandobra/playwright-mark-tasks-e2e/actions/workflows/ci.yml)
[![Playwright](https://img.shields.io/badge/Playwright-v1.62.1-2EAD33?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0.3-6BA539?style=flat-square&logo=openapiinitiative&logoColor=white)](docs/swagger/openapi.yaml)
[![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman&logoColor=white)](docs/postman/MarkTasks.postman_collection.json)

Suíte de testes automatizados **End-to-End (E2E)** para a aplicação de gerenciamento de tarefas **Mark Tasks** (Frontend Web + API REST Express/TypeORM/SQLite), construída com **Playwright** e **TypeScript**.

O projeto combina **Page Object Model (POM)**, preparação híbrida de massa via API (`APIRequestContext`), matriz **multi-browser desktop/mobile** (`30` execuções por suíte), especificações **BDD em Gherkin**, contrato **OpenAPI 3.0**, coleção **Postman** e execução contínua via **GitHub Actions**.

---

## 1. Estratégia e Artefatos de QA

| Artefato | Objetivo | Caminho |
| :--- | :--- | :--- |
| **Plano de Testes** | Escopo, decisão híbrida API+UI, controle de concorrência SQLite e rastreabilidade | [`docs/qa/TEST_PLAN.md`](docs/qa/TEST_PLAN.md) |
| **Casos de Teste** | Inventário dos `6` fluxos E2E (`30` execuções cross-browser) + `7` contratos de API | [`docs/qa/TEST_CASES.md`](docs/qa/TEST_CASES.md) |
| **Cenários BDD (Gherkin)** | Critérios de aceite em sintaxe `Given / When / Then` | [`specs/features/tasks.feature`](specs/features/tasks.feature) |
| **Relatório de Bug** | Evidência de payload desatualizado retornado pelo `PUT /tasks/:id` | [`BUG-001`](docs/qa/bug-reports/BUG-001-stale-payload-on-task-update.md) |
| **OpenAPI / Swagger** | Especificação 3.0.3 dos endpoints `/tasks` e `/helper/tasks` | [`docs/swagger/openapi.yaml`](docs/swagger/openapi.yaml) |
| **Postman Collection** | Coleção v2.1 com asserções `pm.test` e captura automática de `taskId` | [`docs/postman/MarkTasks.postman_collection.json`](docs/postman/MarkTasks.postman_collection.json) |

---

## 2. Arquitetura e Padrões Aplicados

* **Page Object Model (`TasksPage`):** Elementos, localizadores CSS/XPath e asserções de tela encapsulados em [`tests/support/pages/tasks/index.ts`](tests/support/pages/tasks/index.ts).
* **Setup Híbrido via API (`APIRequestContext`):** Os helpers [`deleteTaskByHelper` e `postTask`](tests/support/helpers.ts) preparam e limpam o estado do SQLite diretamente via HTTP (`/helper/tasks/:task_name` e `POST /tasks`) antes da interação na interface, mantendo os testes independentes e rápidos.
* **Dados Tipados:** Massa isolada em [`tests/fixtures/tasks.json`](tests/fixtures/tasks.json) com contrato [`TaskModel`](tests/fixtures/task.model.ts).
* **Cobertura Cross-Browser & Responsiva:** Configurada em [`playwright.config.ts`](playwright.config.ts) para `chromium`, `firefox`, `webkit`, `Mobile Chrome` (`Pixel 5`) e `Mobile Safari` (`iPhone 12`).
* **Isolamento em CI:** Como os 5 projetos compartilham o mesmo arquivo `database.sqlite` e massa fixa, `workers: 1` em `CI=true` evita condições de corrida de escrita.

---

## 3. Estrutura do Repositório

```text
.
├── .github/workflows/
│   └── ci.yml                          # Pipeline CI: SQLite init + API + Web + Playwright (5 projetos)
├── app/
│   ├── api/                            # Backend Node.js (Express + TypeORM + SQLite) - porta 3333
│   └── web/                            # Frontend Web estático - porta 8080
├── docs/
│   ├── postman/                        # Collection v2.1 e Environment local do Postman
│   ├── qa/
│   │   ├── bug-reports/                # Exemplo real de bug report identificado na API
│   │   ├── TEST_CASES.md               # Matriz de casos UI e API
│   │   └── TEST_PLAN.md                # Plano de testes e decisões arquiteturais
│   └── swagger/
│       └── openapi.yaml                # Contrato OpenAPI 3.0.3
├── specs/features/
│   └── tasks.feature                   # Especificação BDD em Gherkin
├── tests/
│   ├── fixtures/
│   │   ├── task.model.ts               # Tipagem TypeScript da entidade Task
│   │   └── tasks.json                  # Massa de dados dos cenários
│   ├── support/
│   │   ├── helpers.ts                  # Helpers HTTP (APIRequestContext)
│   │   └── pages/tasks/index.ts        # Page Object TasksPage
│   ├── home.spec.ts                    # Disponibilidade da aplicação web
│   └── tasks.spec.ts                   # Cadastro, duplicidade, validação HTML5, toggle e exclusão
├── .env.example                        # Template de variáveis de ambiente
├── Insomnia_markL.json                 # Workspace original do Insomnia
├── playwright.config.ts                # Configuração dos 5 projetos, trace e screenshot on-failure
└── package.json
```

---

## 4. Instalação e Execução Local

### Pré-requisitos
* Node.js `>= 22.x` (`better-sqlite3@13` requer Node 22+)
* Navegadores do Playwright (`npx playwright install`)

### 1. Configurar ambiente e dependências

```bash
cp .env.example .env
npm ci
npx playwright install
```

### 2. Iniciar Backend (`app/api` — porta `3333`)

```bash
npm --prefix app/api ci
npm --prefix app/api run db:init
NODE_ENV=development npm --prefix app/api start
```

> `NODE_ENV=development` habilita as rotas `/helper/tasks` usadas para limpeza determinística de massa antes dos testes. Em caso de incompatibilidade de binário nativo do `better-sqlite3` em versões mais novas do Node.js, execute `npm --prefix app/api install better-sqlite3@latest`.

### 3. Iniciar Frontend (`app/web` — porta `8080`)

Em um segundo terminal:

```bash
npm --prefix app/web install
npm --prefix app/web start
```

### 4. Executar a suíte Playwright

Em um terceiro terminal:

```bash
# Todos os testes em modo headless (30 execuções nos 5 projetos)
npm test

# Modo interativo (UI Mode)
npm run test:ui

# Navegador visível (Headed Mode)
npm run test:headed

# Abrir relatório HTML
npm run test:report
```

---

## 5. Pipeline de CI/CD

O workflow [`ci.yml`](.github/workflows/ci.yml) é disparado em `push` e `pull_request` para `main`:
1. Instala dependências da raiz, `app/api` e `app/web`, além dos binários `chromium`, `firefox` e `webkit`.
2. Inicializa o banco SQLite (`db:init`), inicia o backend (`NODE_ENV=development`) e o servidor web (`http-server`).
3. Valida a integridade JSON dos arquivos Postman e executa os `30` testes E2E sequencialmente.
4. Salva o diretório `playwright-report/` como artefato por 14 dias.

---

## 6. Autor

**Luis Fernando Brandão**  
QA Automation Engineer  
* [LinkedIn](https://linkedin.com/in/lfernandobra)  
* [GitHub](https://github.com/lfernandobra)  
* lfernandobra@gmail.com
