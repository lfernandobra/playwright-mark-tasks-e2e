# BUG-001: `PUT /tasks/:id` retorna payload desatualizado antes do update no SQLite

| Campo | Valor |
| :--- | :--- |
| **ID** | `BUG-001` |
| **Severidade** | Média |
| **Prioridade** | P2 |
| **Status** | Aberto — Análise de Código e Contrato |
| **Componente** | `app/api/src/controllers/TaskController.js` (`TaskController.prototype.update`) |
| **Ambiente** | Backend Node.js (`localhost:3333`) + TypeORM / SQLite |

---

## Resumo

Ao atualizar o status `is_done` de uma tarefa via `PUT /tasks/:id`, o endpoint persiste o novo valor no banco SQLite, mas retorna na resposta HTTP `200 OK` o objeto `task` carregado **antes** da operação de `update()`. Como resultado, clientes de API recebem `"is_done": false` mesmo após enviar `"is_done": true`.

---

## Evidência no Código-Fonte

Em [`app/api/src/controllers/TaskController.js`](../../../app/api/src/controllers/TaskController.js) (linhas 167–178):

```javascript
task = await tasksRepository.findOne(id);
if (!task) {
    throw new AppError('Task not found!', 404);
}
await tasksRepository.update(id, {
    is_done: is_done
});
return response.status(200).json(task);
```

A variável `task` é populada na linha 167 (`findOne(id)`), o banco é atualizado na linha 173 (`update(...)`), porém `response.status(200).json(task)` devolve a referência original em memória sem aplicar `is_done` atualizado nem recarregar o registro.

---

## Passos para Reproduzir

1. Criar uma tarefa via API:
   ```bash
   curl -i -X POST http://localhost:3333/tasks \
     -H "Content-Type: application/json" \
     -d '{"name":"Validar PUT /tasks","is_done":false}'
   ```
2. Consultar `GET http://localhost:3333/tasks` e copiar o `id` (UUID) gerado.
3. Atualizar a tarefa para concluída:
   ```bash
   curl -s -X PUT http://localhost:3333/tasks/<TASK_UUID> \
     -H "Content-Type: application/json" \
     -d '{"is_done":true}'
   ```

---

## Comportamento Esperado vs. Obtido

* **Esperado:** HTTP `200 OK` retornando o recurso atualizado com `"is_done": true` (ou `204 No Content` se não houver retorno do recurso).
* **Obtido:** HTTP `200 OK` retornando `"is_done": false` na resposta imediata do `PUT`, exigindo um `GET /tasks` subsequente para enxergar o estado real persistido no SQLite.

---

## Impacto e Correção Recomendada

* **Impacto:** Na UI web, o frontend contorna o problema ou depende de estado local / recarregamento, motivo pelo qual o teste E2E (`TC-UI-05`) passa na interface. Contudo, consumidores diretos da API ou clientes móveis que confiam no retorno do `PUT` leem o estado antigo.
* **Correção sugerida:** Retornar `200` com o objeto atualizado (`{ ...task, is_done }` ou nova leitura via `findOne(id)`) após `tasksRepository.update(...)`.
