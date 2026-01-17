import { test, expect } from '@playwright/test';

test.describe('Contract Payloads', () => {
  test('Cell types are strict enum strings', async ({ page }) => {
    await page.goto('/?level=2&contractTest=1');

    await page.waitForSelector('.cell');

    const cellClasses = await page.$$eval('.cell', cells =>
      cells.map(cell => cell.className.split(' ').filter(Boolean))
    );

    const allowed = new Set(['snake-head', 'snake-body', 'food', 'obstacle', 'exit']);

    const unknownExtras = new Set<string>();
    for (const classes of cellClasses) {
      expect(classes).toContain('cell');
      const extra = classes.filter(
        cls => cls !== 'cell' && !cls.startsWith('svelte-')
      );
      expect(extra.length).toBeLessThanOrEqual(1);
      if (extra.length === 1) {
        if (!allowed.has(extra[0])) {
          unknownExtras.add(extra[0]);
        }
      }
    }
    expect(Array.from(unknownExtras)).toEqual([]);

    const flattened = cellClasses.flat();
    expect(flattened.filter(cls => cls === 'snake-head').length).toBe(1);
    expect(flattened.filter(cls => cls === 'snake-body').length).toBeGreaterThan(0);
  });

  test('processMove updates frame payloads', async ({ page }) => {
    await page.goto('/?level=2&contractTest=1');

    await page.waitForFunction(() => (window as any).__gsnakeContract?.frame);

    const initialMoves = await page.evaluate(() => (window as any).__gsnakeContract.frame.state.moves);

    await page.keyboard.press('ArrowRight');

    await page.waitForFunction(
      moves => (window as any).__gsnakeContract?.frame?.state?.moves === moves + 1,
      initialMoves
    );

    const frame = await page.evaluate(() => (window as any).__gsnakeContract.frame);
    expect(Array.isArray(frame.grid)).toBe(true);
    expect(Array.isArray(frame.grid[0])).toBe(true);
    expect(typeof frame.state.status).toBe('string');
  });

  test('Contract errors surface as typed payloads', async ({ page }) => {
    await page.goto('/?level=2&contractTest=1');

    await page.waitForFunction(() => (window as any).__gsnakeContract?.frame);

    await page.keyboard.press('ArrowLeft');

    await page.waitForFunction(() => (window as any).__gsnakeContract?.error);

    const error = await page.evaluate(() => (window as any).__gsnakeContract.error);
    expect(typeof error.kind).toBe('string');
    expect(typeof error.message).toBe('string');
    expect(
      ['invalidInput', 'inputRejected', 'serializationFailed', 'initializationFailed', 'internalError']
        .includes(error.kind)
    ).toBe(true);
  });
});
