import { test, expect } from '@playwright/test';

test.describe('Contract Payloads', () => {
  test('Cell types are strict enum strings', async ({ page }) => {
    await page.goto('/?level=2');

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
});
