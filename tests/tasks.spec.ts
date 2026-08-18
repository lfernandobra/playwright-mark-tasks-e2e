import { test, expect } from "@playwright/test";

test("deve poder cadastrar uma nova tarefa", async ({ page }) => {
  await page.goto("http://localhost:8080");

  const inputTaskName = page.locator("input[class*=InputNewTask]");
  await inputTaskName.fill("Ler um livro de TypeScript");

  //   await inputTaskName.press("Enter");

  // usando xPath
  // button[contains(text(), "Create")]
  // await page.click('xpath=//button[contains(text(), "Create")]');
  // Recurso novo do Playwright para facilitar a busca de elementos
  await page.click("css=button >> text=Create");
});
