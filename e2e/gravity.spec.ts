import { test, expect, type Locator } from '@playwright/test';
import type { LevelDefinition } from './level-definition';

const LEVEL_ONE_SOLUTION_KEYS = ['ArrowRight', 'ArrowRight'] as const;
const EXPECTED_LEVEL_ONE_COMPLETION_MOVES = LEVEL_ONE_SOLUTION_KEYS.length;

const FIXTURE_LEVELS: LevelDefinition[] = [
  {
    id: 1,
    name: 'E2E deterministic progression level',
    gridSize: { width: 6, height: 5 },
    snake: [
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ],
    obstacles: [
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
      { x: 5, y: 2 },
    ],
    food: [{ x: 2, y: 1 }],
    exit: { x: 3, y: 1 },
    snakeDirection: 'East',
    floatingFood: [],
    fallingFood: [],
    stones: [],
    spikes: [],
    totalFood: 1,
  },
  {
    id: 2,
    name: 'E2E deterministic game-over level',
    gridSize: { width: 6, height: 5 },
    snake: [
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ],
    obstacles: [],
    food: [{ x: 4, y: 1 }],
    exit: { x: 5, y: 1 },
    snakeDirection: 'East',
    floatingFood: [],
    fallingFood: [],
    stones: [],
    spikes: [{ x: 1, y: 2 }],
    totalFood: 1,
  },
];

const ALL_COMPLETE_FIXTURE_LEVELS: LevelDefinition[] = [FIXTURE_LEVELS[0]];

function getFixtureLevelsUrl(levels: LevelDefinition[]): string {
  const payload = encodeURIComponent(JSON.stringify(levels));
  return `data:application/json,${payload}`;
}

async function readCounter(locator: Locator): Promise<number> {
  const text = (await locator.textContent()) ?? '0';
  const value = Number.parseInt(text, 10);
  return Number.isNaN(value) ? 0 : value;
}

test.describe('Gameplay progression flow', () => {
  test('covers completion, level progression, and game-over restart flows', async ({ page }) => {
    test.setTimeout(20_000);

    const levelsUrl = encodeURIComponent(getFixtureLevelsUrl(FIXTURE_LEVELS));
    await page.goto(`/?level=1&levelsUrl=${levelsUrl}`);
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

    for (const key of LEVEL_ONE_SOLUTION_KEYS) {
      await pressAndExpectMoveIncrement(key);
    }

    await expect(movesDisplay).toHaveText(String(EXPECTED_LEVEL_ONE_COMPLETION_MOVES));
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

  test('shows AllComplete overlay on final-level completion and q returns to level 1', async ({ page }) => {
    test.setTimeout(20_000);

    const levelsUrl = encodeURIComponent(getFixtureLevelsUrl(ALL_COMPLETE_FIXTURE_LEVELS));
    await page.goto(`/?level=1&levelsUrl=${levelsUrl}`);
    await page.waitForSelector('.cell');

    const levelDisplay = page.locator('[data-element-id="level-display"]');
    const movesDisplay = page.locator('[data-element-id="moves-display"]');
    const overlay = page.locator('[data-element-id="overlay"]');
    const levelCompleteBanner = page.locator('[data-element-id="level-complete-banner"]');
    const allCompleteHeading = page.getByRole('heading', { name: 'All Levels Complete!' });

    const pressAndExpectMoveIncrement = async (key: string) => {
      const before = await readCounter(movesDisplay);
      await page.keyboard.press(key);
      await expect(movesDisplay).toHaveText(String(before + 1));
    };

    await expect(levelDisplay).toHaveText('1');
    await expect(movesDisplay).toHaveText('0');

    for (const key of LEVEL_ONE_SOLUTION_KEYS) {
      await pressAndExpectMoveIncrement(key);
    }

    await expect(movesDisplay).toHaveText(String(EXPECTED_LEVEL_ONE_COMPLETION_MOVES));
    await expect(levelCompleteBanner).toHaveCount(0);
    await expect(overlay).toBeVisible();
    await expect(allCompleteHeading).toBeVisible();

    await page.keyboard.press('q');

    await expect(allCompleteHeading).toHaveCount(0);
    await expect(overlay).toHaveCount(0);
    await expect(levelDisplay).toHaveText('1');
    await expect(movesDisplay).toHaveText('0');

    await pressAndExpectMoveIncrement('ArrowRight');
  });
});
