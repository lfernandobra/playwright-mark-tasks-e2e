# Inventário de Casos de Teste — Mark Tasks

---

## 1. Suíte Automatizada Web E2E (`tests/`)

Cada caso abaixo é executado nos `5` projetos configurados em `playwright.config.ts` (`chromium`, `firefox`, `webkit`, `Mobile Chrome`, `Mobile Safari`), totalizando `30` execuções por rodada.

| ID | Arquivo | Cenário | Pré-condição / Massa | Resultado Esperado | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `TC-UI-01` | `home.spec.ts` | Webapp deve estar online | Servidor web ativo em `localhost:8080` | Título da página igual a `"Gerencie suas tarefas com Mark L"` | Automatizado |
| `TC-UI-02` | `tasks.spec.ts` | Cadastrar nova tarefa | `"Ler um livro de Typescript"` removida via `DELETE /helper/tasks/:task_name` | Tarefa exibida no grid (`.task-item p`) | Automatizado |
| `TC-UI-03` | `tasks.spec.ts` | Bloquear tarefa duplicada | `"Comprar Ketchup"` pré-cadastrada via `POST /tasks` | Modal `.swal2-html-container` exibe `"Task already exists!"` | Automatizado |
| `TC-UI-04` | `tasks.spec.ts` | Validar campo obrigatório | Input vazio (`name: ""`) | `inputTaskName.validationMessage` igual a `"This is a required field"` | Automatizado |
| `TC-UI-05` | `tasks.spec.ts` | Concluir tarefa (Toggle) | `"Pagar a fatura do cartão de crédito"` pré-cadastrada com `is_done: false` | Ao clicar em `Toggle`, texto recebe CSS `text-decoration-line: line-through` | Automatizado |
| `TC-UI-06` | `tasks.spec.ts` | Excluir tarefa | `"Estudar Ruby"` pré-cadastrada com `is_done: false` | Ao clicar em `Delete`, tarefa deixa de ficar visível na lista | Automatizado |

---

## 2. Contratos de API Validados (Postman / OpenAPI)

| ID | Endpoint | Cenário | Resultado Esperado | Status |
| :--- | :--- | :--- | :--- | :---: |
| `TC-API-01` | `POST /tasks` | Criar tarefa válida (`is_done: false`) | `201 Created` (body vazio) | Coleção Postman |
| `TC-API-02` | `POST /tasks` | Rejeitar tarefa com nome duplicado | `400 Bad Request` (`"Task already exists!"`) | Coleção Postman |
| `TC-API-03` | `POST /tasks` | Rejeitar tarefa criada já como concluída (`is_done: true`) | `400 Bad Request` (`"The task cannot be registered as completed."`) | Coleção Postman |
| `TC-API-04` | `GET /tasks` | Listar tarefas cadastradas | `200 OK` com array ordenado por `created_at ASC` | Coleção Postman |
| `TC-API-05` | `PUT /tasks/:id` | Atualizar flag `is_done` de tarefa existente | `200 OK` *(ver `BUG-001` sobre payload desatualizado na resposta)* | Coleção Postman |
| `TC-API-06` | `PUT /tasks/:id` | Atualizar tarefa com UUID inexistente | `404 Not Found` (`"Task not found!"`) | Coleção Postman |
| `TC-API-07` | `DELETE /tasks/:id` | Excluir tarefa por UUID | `204 No Content` | Coleção Postman |
