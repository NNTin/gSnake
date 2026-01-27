import { test, expect, Page } from '@playwright/test';

async function startNewLevel(page: Page) {
  await page.goto('http://localhost:3003', { waitUntil: 'networkidle' });

  const createNewButton = page.getByRole('button', { name: 'Create New Level' });
  await expect(createNewButton).toBeVisible();
  await createNewButton.click();

  const createModalButton = page.locator('.modal').getByRole('button', { name: 'Create' });
  await expect(createModalButton).toBeVisible();
  await createModalButton.click();

  await expect(page.locator('.canvas-area')).toBeVisible({ timeout: 10000 });
}

async function clickCell(page: Page, row: number, col: number) {
  await page.locator(`.cell[data-row="${row}"][data-col="${col}"]`).click();
}

test('Test level editor workflow', async ({ page }) => {
  await startNewLevel(page);

  await page.getByRole('button', { name: 'Snake' }).click();
  await clickCell(page, 7, 7);
  await clickCell(page, 7, 8);

  await page.getByRole('button', { name: 'Food', exact: true }).click();
  await clickCell(page, 5, 5);

  await page.getByRole('button', { name: 'Exit' }).click();
  await clickCell(page, 10, 10);

  const testButton = page.getByRole('button', { name: 'Test' });
  await expect(testButton).toBeVisible();

  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    testButton.click()
  ]);

  await newPage.waitForLoadState('networkidle');

  expect(newPage.url()).toContain('http://localhost:3000');
  expect(newPage.url()).toContain('test=true');

  await newPage.waitForTimeout(2000);

  const errorMessage = newPage.locator('text=/Failed to load test level/');
  await expect(errorMessage).not.toBeVisible();
});
