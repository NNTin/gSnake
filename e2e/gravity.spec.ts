import { test, expect, type Locator } from '@playwright/test';

async function readCounter(locator: Locator): Promise<number> {
  const text = (await locator.textContent()) ?? '0';
  const value = Number.parseInt(text, 10);
  return Number.isNaN(value) ? 0 : value;
}

test.describe('Gameplay progression flow', () => {
  test('covers completion, level progression, and game-over restart flows', async ({ page }) => {
    test.setTimeout(20_000);

    await page.goto('/');
    await page.waitForSelector('.cell');

    const levelDisplay = page.locator('[data-element-id="level-display"]');
    const movesDisplay = page.locator('[data-element-id="moves-display"]');
    const levelCompleteBanner = page.locator('[data-element-id="level-complete-banner"]');
    const levelSelectorButton = page.locator('[data-element-id="level-selector-btn"]');
    const levelSelectorOverlay = page.locator('[data-element-id="level-selector-overlay"]');
    const gameOverHeading = page.getByRole('heading', { name: 'Game Over' });
    const restartLevelButton = page.locator('[data-element-id="restart-level-btn"]');

    const pressAndExpectMoveIncrement = async (key: string) => {
      const before = await readCounter(movesDisplay);
      await page.keyboard.press(key);
      await expect(movesDisplay).toHaveText(String(before + 1));
    };

    await expect(levelDisplay).toHaveText('1');
    await expect(movesDisplay).toHaveText('0');

    for (let i = 0; i < 11; i += 1) {
      await pressAndExpectMoveIncrement('ArrowRight');
    }

    await expect(levelCompleteBanner).toBeVisible();
    await expect(levelCompleteBanner).toContainText('Level Complete!');

    await levelSelectorButton.click();
    await expect(levelSelectorOverlay).toBeVisible();

    const levelTwoCard = page.getByRole('button', { name: /^Level 2\b/ });
    await expect(levelTwoCard).toBeVisible();
    await levelTwoCard.click();

    await expect(levelDisplay).toHaveText('2');
    await expect(movesDisplay).toHaveText('0');
    await expect(levelSelectorOverlay).toHaveCount(0);

    await pressAndExpectMoveIncrement('ArrowDown');
    await expect(gameOverHeading).toBeVisible();

    await restartLevelButton.click();
    await expect(gameOverHeading).toHaveCount(0);
    await expect(levelDisplay).toHaveText('2');
    await expect(movesDisplay).toHaveText('0');

    await pressAndExpectMoveIncrement('ArrowDown');
    await expect(gameOverHeading).toBeVisible();

    await page.keyboard.press('Space');
    await expect(gameOverHeading).toHaveCount(0);
    await expect(levelDisplay).toHaveText('2');
    await expect(movesDisplay).toHaveText('0');
  });
});
