import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test("deve poder cadastrar uma nova tarefa", async ({ page }) => {
  await page.goto("http://localhost:8080");

  const inputTaskName = page.locator("input[class*=InputNewTask]");
  // instalando o Faker : yarn add @faker-js/faker -D
  await inputTaskName.fill(faker.lorem.words());

  await page.click("css=button >> text=Create");
});
