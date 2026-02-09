import { promises as fs } from 'node:fs';
import { test, expect, type APIRequestContext, type Page } from '@playwright/test';

const EDITOR_URL = 'http://localhost:3003';
const WEB_URL = 'http://localhost:3000';
const TEST_LEVEL_API_URL = 'http://localhost:3001/api/test-level';

type Position = { x: number; y: number };

type LevelDefinition = {
  id: number;
  name: string;
  gridSize: { width: number; height: number };
  snake: Position[];
  obstacles: Position[];
  food: Position[];
  exit: Position | null;
  snakeDirection: 'North' | 'South' | 'East' | 'West';
  floatingFood?: Position[];
  fallingFood?: Position[];
  stones?: Position[];
  spikes?: Position[];
  totalFood: number;
};

function cell(page: Page, row: number, col: number) {
  return page.locator(`.cell[data-row="${row}"][data-col="${col}"]`);
}

async function waitForService(
  request: APIRequestContext,
  url: string,
  acceptableStatuses: Set<number>,
  attempts = 20
): Promise<void> {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await request.get(url, { failOnStatusCode: false, timeout: 2000 });
      if (acceptableStatuses.has(response.status())) {
        return;
      }
    } catch {
      // Retry while services are still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Service at ${url} was not ready after ${attempts} attempts`);
}

async function createNewLevel(page: Page, width: number, height: number): Promise<void> {
  await page.goto(EDITOR_URL, { waitUntil: 'domcontentloaded' });

  await expect(page.getByRole('button', { name: 'Create New Level' })).toBeVisible();
  await page.getByRole('button', { name: 'Create New Level' }).click();

  const modal = page.locator('.modal');
  await expect(modal.getByRole('heading', { name: 'Create New Level' })).toBeVisible();
  await modal.getByLabel('Width').fill(String(width));
  await modal.getByLabel('Height').fill(String(height));
  await modal.getByRole('button', { name: 'Create' }).click();

  await expect(page.locator('.canvas-area')).toBeVisible();
}

test.describe('Editor create-save-load workflow', () => {
  test('creates a level, saves and reloads it, then hands off test data to gsnake-web', async ({ page, context, request }, testInfo) => {
    test.setTimeout(45_000);

    await waitForService(request, EDITOR_URL, new Set([200]));
    await waitForService(request, WEB_URL, new Set([200]));
    await waitForService(request, TEST_LEVEL_API_URL, new Set([200, 404]));

    await createNewLevel(page, 8, 6);

    await cell(page, 1, 1).click();
    await cell(page, 1, 2).click();
    await page.getByRole('button', { name: 'Food', exact: true }).click();
    await cell(page, 2, 4).click();
    await page.getByRole('button', { name: 'Exit' }).click();
    await cell(page, 4, 6).click();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('heading', { name: 'Save Level' })).toBeVisible();
    await page.getByLabel('Level Name').fill('E2E Save Load Level');
    await page.getByLabel('Difficulty').selectOption('hard');
    await page.getByRole('button', { name: 'Export' }).click();

    const download = await downloadPromise;
    const exportedLevelPath = testInfo.outputPath(download.suggestedFilename());
    await download.saveAs(exportedLevelPath);

    const exportedLevel = JSON.parse(
      await fs.readFile(exportedLevelPath, 'utf8')
    ) as LevelDefinition;

    expect(exportedLevel.name).toBe('E2E Save Load Level');
    expect(exportedLevel.gridSize).toEqual({ width: 8, height: 6 });
    expect(exportedLevel.snake).toEqual([
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ]);
    expect(exportedLevel.food).toEqual([{ x: 4, y: 2 }]);
    expect(exportedLevel.exit).toEqual({ x: 6, y: 4 });
    expect(exportedLevel.snakeDirection).toBe('East');
    expect(exportedLevel.totalFood).toBe(1);

    await page.getByRole('button', { name: 'New Level' }).click();
    await expect(page.getByRole('button', { name: 'Create New Level' })).toBeVisible();

    const landingLoadChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Load Existing Level' }).click();
    const landingLoadChooser = await landingLoadChooserPromise;
    await landingLoadChooser.setFiles(exportedLevelPath);

    await expect(page.locator('.canvas-area')).toBeVisible();
    await expect(page.locator('.cell')).toHaveCount(48);
    await expect(page.getByRole('combobox')).toHaveValue('east');
    await expect(cell(page, 1, 1)).toHaveClass(/is-snake-segment/);
    await expect(cell(page, 1, 1)).toHaveText('H');
    await expect(cell(page, 1, 2)).toHaveText('1');
    await expect(cell(page, 2, 4)).toHaveClass(/has-entity/);
    await expect(cell(page, 4, 6)).toHaveClass(/has-entity/);

    await page.getByRole('button', { name: 'Obstacle' }).click();
    await cell(page, 0, 0).click();
    await expect(cell(page, 0, 0)).toHaveClass(/has-entity/);

    const toolbarLoadChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Load' }).click();
    const toolbarLoadChooser = await toolbarLoadChooserPromise;
    await toolbarLoadChooser.setFiles(exportedLevelPath);

    await expect(cell(page, 0, 0)).not.toHaveClass(/has-entity/);
    await expect(cell(page, 1, 1)).toHaveText('H');
    await expect(cell(page, 1, 2)).toHaveText('1');

    const popupPromise = context.waitForEvent('page');
    const postResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/test-level') &&
        response.request().method() === 'POST'
    );
    const getResponsePromise = context.waitForEvent(
      'response',
      (response) =>
        response.url().includes('/api/test-level') &&
        response.request().method() === 'GET' &&
        response.status() === 200
    );

    await page.getByRole('button', { name: 'Test' }).click();

    const [popup, postResponse, getResponse] = await Promise.all([
      popupPromise,
      postResponsePromise,
      getResponsePromise,
    ]);

    expect(postResponse.ok()).toBeTruthy();
    const postedLevel = postResponse.request().postDataJSON() as LevelDefinition;
    expect(postedLevel.id).toBe(999999);
    expect(postedLevel.name).toBe('Test Level');
    expect(postedLevel.gridSize).toEqual({ width: 8, height: 6 });
    expect(postedLevel.snake).toEqual(exportedLevel.snake);
    expect(postedLevel.food).toEqual(exportedLevel.food);
    expect(postedLevel.exit).toEqual(exportedLevel.exit);
    expect(postedLevel.totalFood).toBe(1);

    const fetchedLevel = (await getResponse.json()) as LevelDefinition;
    expect(fetchedLevel.id).toBe(999999);
    expect(fetchedLevel.snake).toEqual(exportedLevel.snake);
    expect(fetchedLevel.food).toEqual(exportedLevel.food);
    expect(fetchedLevel.exit).toEqual(exportedLevel.exit);

    await popup.waitForLoadState('domcontentloaded');
    await expect(popup).toHaveURL(/http:\/\/localhost:3000\/\?test=true/);
    await expect(popup.locator('[data-element-id="game-field"]')).toBeVisible();
    await expect(popup.locator('[data-element-id="level-display"]')).toHaveText(String(postedLevel.id));
    await expect(popup.locator('text=/Failed to load test level/i')).toHaveCount(0);
  });
});
