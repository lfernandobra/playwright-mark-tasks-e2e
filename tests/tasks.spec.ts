import { test, expect } from "@playwright/test";

test("deve poder cadastrar uma nova tarefa", async ({ page, request }) => {
  // Dado que eu tenho uma nova tarefa
  const taskName = "Ler um livro de Typescript";
  await request.delete(`http://localhost:3333/helper/tasks/${taskName}`);

  // E que eu estou na página de cadastro
  await page.goto("http://localhost:8080");

  // Quando faço o cadastro dessa tarefa
  const inputTaskName = page.locator("input[class*=InputNewTask]");
  await inputTaskName.fill("Ler um livro de Typescript");
  await page.click("css=button >> text=Create");

  // Então essa tarefa deve ser exibida na lista
  // por testId
  //const target = page.getByTestId("task-item");
  // por class
  //const target = page.locator(".task-item");
  // por xPath
  //const target = page.locator("div[class*=listItem]");
  // selector css combinado com estrategia de localizacao por texto
  const target = page.locator(`css=.task-item p >> text=${taskName}`);

  //await expect(target).toHaveText(taskName);
  await expect(target).toBeVisible();
});
