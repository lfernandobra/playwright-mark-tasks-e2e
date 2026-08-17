import { test, expect } from "@playwright/test";

test("deve poder cadastrar uma nova tarefa", async ({ page }) => {
  await page.goto("http://localhost:8080");
  // por id
  //   await page.fill("#newTask", "Ler um livro de TypeScript");

  // por placeholder
  //   await page.fill(
  //     'input[placeholder="Add a new Task"]',
  //     "Ler um livro de TypeScript",
  //   );

  // por type
  //await page.fill("input[type=text]", "Ler um livro de TypeScript");

  // por classe
  //await page.fill("._listInputNewTask_1y0mp_21", "Ler um livro de TypeScript");

  // por classe por regex
  await page.fill("input[class*=InputNewTask]", "Ler um livro de TypeScript");
});
