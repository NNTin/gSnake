import { test, expect, Page } from '@playwright/test';

async function startNewLevel(page: Page) {
  await page.goto('http://localhost:3003', { waitUntil: 'networkidle' });

  const createNewButton = page.getByRole('button', { name: 'Create New Level' });
  await expect(createNewButton).toBeVisible();
  await createNewButton.click();

  const createDialog = page.getByRole('dialog');
  const createModalButton = createDialog.getByRole('button', { name: 'Create' });
  await expect(createModalButton).toBeVisible();
  await createModalButton.click();

  await expect(page.locator('.canvas-area')).toBeVisible({ timeout: 10000 });
}

async function clickCell(page: Page, row: number, col: number) {
  await page.locator(`.cell[data-row="${row}"][data-col="${col}"]`).click();
}

test.describe('Level Editor Test Workflow', () => {
  test('should upload and test a level without CORS errors', async ({ page, context }) => {
    test.setTimeout(20_000);

    await startNewLevel(page);

    // Place a simple valid level
    await page.getByRole('button', { name: 'Snake' }).click();
    await clickCell(page, 7, 7);
    await clickCell(page, 7, 8);
    await clickCell(page, 7, 9);

    await page.getByRole('button', { name: 'Food', exact: true }).click();
    await clickCell(page, 5, 5);

    await page.getByRole('button', { name: 'Exit' }).click();
    await clickCell(page, 10, 10);

    const testButton = page.getByRole('button', { name: 'Test' });
    await expect(testButton).toBeVisible();

    const consoleMessages: string[] = [];
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });

    const popupPromise = context.waitForEvent('page');
    await testButton.click();

    const popup = await popupPromise;
    await popup.waitForLoadState('networkidle');

    expect(popup.url()).toContain('http://localhost:3000');
    expect(popup.url()).toContain('test=true');

    await popup.waitForTimeout(2000);

    const errorText = 'Failed to load test level';
    const bodyText = await popup.textContent('body');
    if (bodyText && bodyText.includes(errorText)) {
      throw new Error(`Found error message: "${errorText}"`);
    }

    const corsErrors = consoleMessages.filter(msg =>
      msg.toLowerCase().includes('cors') ||
      msg.toLowerCase().includes('cross-origin')
    );

    expect(corsErrors.length).toBe(0);

    const gameContainer = popup.locator('#app, .game-container, canvas');
    await expect(gameContainer.first()).toBeVisible({ timeout: 5000 });
  });
});
