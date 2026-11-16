# Plano de Testes — Mark Tasks (E2E Web & API)

**Autor:** Luis Fernando Brandão  
**Aplicação Alvo:** Mark Tasks (`app/web` na porta `8080` + `app/api` Express/TypeORM/SQLite na porta `3333`)  
**Ferramenta Principal:** Playwright Test + TypeScript  

---

## 1. Objetivo e Escopo

Validar os fluxos críticos de criação, duplicidade, validação de formulário, atualização de status e exclusão de tarefas na aplicação **Mark Tasks**, garantindo comportamento consistente entre navegadores desktop e viewports mobile.

### Dentro do Escopo
* **Disponibilidade Web (`home.spec.ts`):** Carregamento inicial da aplicação e título da página.
* **Gestão de Tarefas via UI (`tasks.spec.ts`):** Cadastro, bloqueio de tarefa duplicada via modal SweetAlert2 (`.swal2-html-container`), validação nativa HTML5 de campo obrigatório, marcação de tarefa concluída (`line-through`) e exclusão.
* **Preparação Híbrida via API (`tests/support/helpers.ts`):** Limpeza e pré-cadastro de massa direto nos endpoints `/helper/tasks/:task_name` e `POST /tasks` via `APIRequestContext`.
* **Matriz Cross-Browser & Responsiva (`playwright.config.ts`):** Execução nos projetos `chromium`, `firefox`, `webkit`, `Mobile Chrome` (`Pixel 5`) e `Mobile Safari` (`iPhone 12`).

### Fora do Escopo
* Testes de carga/estresse no SQLite.
* Autenticação de usuário (a versão atual do Mark Tasks opera sem controle de sessão).

---

## 2. Estratégia e Decisões Técnicas

1. **Testes Híbridos (API Setup + UI Validation):**  
   Em vez de usar a interface gráfica para limpar ou pré-cadastrar dados antes dos testes de duplicidade, toggle e exclusão, os helpers `deleteTaskByHelper()` e `postTask()` manipulam o estado diretamente via `APIRequestContext`. Isso reduz o tempo de setup, evita dependência em cadeia entre specs e isola falhas reais de UI.
2. **Page Object Model (`TasksPage`):**  
   Seletores e interações de página ficam encapsulados em [`tests/support/pages/tasks/index.ts`](../../tests/support/pages/tasks/index.ts), mantendo os arquivos `*.spec.ts` focados em intenção de negócio e asserções.
3. **Execução Sequencial em CI com SQLite (`workers: 1`):**  
   Como os 5 projetos (`chromium`, `firefox`, `webkit`, `Mobile Chrome`, `Mobile Safari`) compartilham o mesmo arquivo `database.sqlite` e os mesmos nomes de massa definidos em `tasks.json`, o `playwright.config.ts` define `workers: process.env.CI ? 1 : undefined` e `retries: process.env.CI ? 2 : 0` para evitar condições de corrida entre workers no banco SQLite durante o pipeline.
4. **Observabilidade em Falhas:**  
   Screenshots são capturados apenas em falhas (`only-on-failure`) e o trace viewer é gravado na primeira retentativa (`on-first-retry`), mantendo o relatório HTML enxuto sem perder evidência de debug.

---

## 3. Matriz de Rastreabilidade

| Fluxo | Cenário BDD | Especificação Playwright | Contrato Relacionado |
| :--- | :--- | :--- | :--- |
| Disponibilidade da Home | `specs/features/tasks.feature` | `tests/home.spec.ts` | Web (`GET /`) |
| Cadastro com Sucesso | `specs/features/tasks.feature` | `tests/tasks.spec.ts` | `DELETE /helper/tasks/:task_name` |
| Bloqueio de Duplicidade | `specs/features/tasks.feature` | `tests/tasks.spec.ts` | `POST /tasks` (`400 Task already exists!`) |
| Campo Obrigatório (HTML5) | `specs/features/tasks.feature` | `tests/tasks.spec.ts` | Atributo `validationMessage` no input |
| Concluir Tarefa (Toggle) | `specs/features/tasks.feature` | `tests/tasks.spec.ts` | `PUT /tasks/:id` (`is_done: true`) |
| Excluir Tarefa | `specs/features/tasks.feature` | `tests/tasks.spec.ts` | `DELETE /tasks/:id` (`204 No Content`) |

---

## 4. Critérios de Entrada e Saída

### Critérios de Entrada
* Banco SQLite inicializado via `npm --prefix app/api run db:init`.
* API rodando em `NODE_ENV=development` (para habilitar as rotas `/helper/tasks` usadas nos testes) na porta `3333`.
* Frontend web ativo na porta `8080`.

### Critérios de Saída
* `30` execuções (`6` casos x `5` projetos desktop/mobile) passando sem `test.only` (`forbidOnly: true`) no GitHub Actions.
* Contratos de API compatíveis com a coleção Postman (`docs/postman/`) e especificação OpenAPI (`docs/swagger/openapi.yaml`).
* Defeito identificado na resposta do `PUT /tasks/:id` documentado em [`BUG-001`](./bug-reports/BUG-001-stale-payload-on-task-update.md).
