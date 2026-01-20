import { test, expect } from '@playwright/test';

const GRID_SIZE = 15;

test.describe('Level Completion Flow', () => {
  test('Completes level 1 and level 2', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.cell');

    const levelDisplay = page.locator('[data-element-id="level-display"]');
    const movesDisplay = page.locator('[data-element-id="moves-display"]');
    const lengthDisplay = page.locator('[data-element-id="length-display"]');
    const cells = page.locator('.cell');

    const expectHeadAt = async (x: number, y: number) => {
      const index = y * GRID_SIZE + x;
      await expect(cells.nth(index)).toHaveClass(/snake-head/);
    };

    const pressAndWait = async (key: string) => {
      const movesText = await movesDisplay.textContent();
      const moves = Number(movesText ?? '0');
      await page.keyboard.press(key);
      await expect(movesDisplay).toHaveText(String(moves + 1));
    };

    await expect(levelDisplay).toHaveText('1');
    await expectHeadAt(2, 13);

    for (let i = 0; i < 11; i += 1) {
      await pressAndWait('ArrowRight');
    }

    await expectHeadAt(13, 13);
    await expect(levelDisplay).toHaveText('2', { timeout: 5000 });
    await expectHeadAt(2, 2);

    const level2Moves: Array<{
      key: string;
      head?: { x: number; y: number };
      length?: number;
    }> = [
      { key: 'ArrowRight' },
      { key: 'ArrowRight' },
      { key: 'ArrowRight' },
      { key: 'ArrowRight', head: { x: 6, y: 5 } },
      { key: 'ArrowDown', head: { x: 6, y: 6 } },
      { key: 'ArrowLeft', head: { x: 5, y: 6 }, length: 4 },
      { key: 'ArrowUp', head: { x: 5, y: 5 } },
      { key: 'ArrowRight', head: { x: 6, y: 5 } },
      { key: 'ArrowRight', head: { x: 7, y: 5 } },
      { key: 'ArrowRight', head: { x: 8, y: 6 } },
      { key: 'ArrowRight', head: { x: 9, y: 6 } },
      { key: 'ArrowRight', head: { x: 10, y: 9 } },
      { key: 'ArrowRight', head: { x: 11, y: 9 } },
      { key: 'ArrowRight', head: { x: 12, y: 9 } },
      { key: 'ArrowRight', head: { x: 13, y: 9 } },
      { key: 'ArrowRight', head: { x: 14, y: 12 } },
      { key: 'ArrowUp', head: { x: 14, y: 11 } },
      { key: 'ArrowLeft', head: { x: 13, y: 11 } },
      { key: 'ArrowDown', head: { x: 13, y: 12 } },
      { key: 'ArrowDown', head: { x: 13, y: 13 } },
    ];

    for (const move of level2Moves) {
      await pressAndWait(move.key);
      if (move.length) {
        await expect(lengthDisplay).toHaveText(String(move.length));
      }
      if (move.head) {
        await expectHeadAt(move.head.x, move.head.y);
      }
    }

    await expect(levelDisplay).toHaveText('3', { timeout: 5000 });
  });
});
