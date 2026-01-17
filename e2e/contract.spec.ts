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

test.describe('Error Contract Tests', () => {
  test('inputRejected error on 180-degree turn', async ({ page }) => {
    await page.goto('/?level=2&contractTest=1');

    await page.waitForFunction(() => (window as any).__gsnakeContract?.frame);

    // Get initial direction
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);

    // Try opposite direction (180-degree turn)
    await page.keyboard.press('ArrowLeft');

    await page.waitForFunction(() => (window as any).__gsnakeContract?.error);

    const error = await page.evaluate(() => (window as any).__gsnakeContract.error);
    expect(error.kind).toBe('inputRejected');
    expect(typeof error.message).toBe('string');
    expect(error.message.length).toBeGreaterThan(0);
  });

  test('error structure includes all required fields', async ({ page }) => {
    await page.goto('/?level=2&contractTest=1');

    await page.waitForFunction(() => (window as any).__gsnakeContract?.frame);

    await page.keyboard.press('ArrowLeft');

    await page.waitForFunction(() => (window as any).__gsnakeContract?.error);

    const error = await page.evaluate(() => (window as any).__gsnakeContract.error);

    // Required fields
    expect(error).toHaveProperty('kind');
    expect(error).toHaveProperty('message');

    // Optional context field
    if (error.context) {
      expect(typeof error.context).toBe('object');
      Object.values(error.context).forEach((value: any) => {
        expect(typeof value).toBe('string');
      });
    }
  });

  test('error uses camelCase for kind field', async ({ page }) => {
    await page.goto('/?level=2&contractTest=1');

    await page.waitForFunction(() => (window as any).__gsnakeContract?.frame);

    await page.keyboard.press('ArrowLeft');

    await page.waitForFunction(() => (window as any).__gsnakeContract?.error);

    const error = await page.evaluate(() => (window as any).__gsnakeContract.error);

    // Error kind should be camelCase
    const validKinds = [
      'invalidInput',
      'inputRejected',
      'serializationFailed',
      'initializationFailed',
      'internalError'
    ];
    expect(validKinds).toContain(error.kind);

    // Should not be snake_case or PascalCase
    expect(error.kind).not.toMatch(/_/);
    expect(error.kind[0]).toBe(error.kind[0].toLowerCase());
  });
});

test.describe('Boundary Tests', () => {
  test('grid boundaries are respected', async ({ page }) => {
    await page.goto('/?level=2&contractTest=1');

    await page.waitForFunction(() => (window as any).__gsnakeContract?.frame);

    const frame = await page.evaluate(() => (window as any).__gsnakeContract.frame);

    // Verify grid has consistent dimensions
    expect(Array.isArray(frame.grid)).toBe(true);
    expect(frame.grid.length).toBeGreaterThan(0);

    const rowLength = frame.grid[0].length;
    frame.grid.forEach((row: any[]) => {
      expect(row.length).toBe(rowLength);
    });
  });

  test('all grid cells contain valid CellType values', async ({ page }) => {
    await page.goto('/?level=2&contractTest=1');

    await page.waitForFunction(() => (window as any).__gsnakeContract?.frame);

    const frame = await page.evaluate(() => (window as any).__gsnakeContract.frame);
    const validCellTypes = ['Empty', 'SnakeHead', 'SnakeBody', 'Food', 'Obstacle', 'Exit'];

    frame.grid.forEach((row: string[], rowIdx: number) => {
      row.forEach((cell: string, colIdx: number) => {
        expect(validCellTypes).toContain(cell);
      });
    });
  });

  test('GameState uses camelCase field names', async ({ page }) => {
    await page.goto('/?level=2&contractTest=1');

    await page.waitForFunction(() => (window as any).__gsnakeContract?.frame);

    const state = await page.evaluate(() => (window as any).__gsnakeContract.frame.state);

    // Check for camelCase fields
    expect(state).toHaveProperty('currentLevel');
    expect(state).toHaveProperty('foodCollected');
    expect(state).toHaveProperty('totalFood');
    expect(state).toHaveProperty('moves');
    expect(state).toHaveProperty('status');

    // Verify no snake_case fields
    expect(state).not.toHaveProperty('current_level');
    expect(state).not.toHaveProperty('food_collected');
    expect(state).not.toHaveProperty('total_food');
  });

  test('GameState has valid number values', async ({ page }) => {
    await page.goto('/?level=2&contractTest=1');

    await page.waitForFunction(() => (window as any).__gsnakeContract?.frame);

    const state = await page.evaluate(() => (window as any).__gsnakeContract.frame.state);

    expect(typeof state.currentLevel).toBe('number');
    expect(typeof state.moves).toBe('number');
    expect(typeof state.foodCollected).toBe('number');
    expect(typeof state.totalFood).toBe('number');

    expect(state.currentLevel).toBeGreaterThanOrEqual(0);
    expect(state.moves).toBeGreaterThanOrEqual(0);
    expect(state.foodCollected).toBeGreaterThanOrEqual(0);
    expect(state.totalFood).toBeGreaterThan(0);
    expect(state.foodCollected).toBeLessThanOrEqual(state.totalFood);
  });

  test('GameStatus enum uses PascalCase', async ({ page }) => {
    await page.goto('/?level=2&contractTest=1');

    await page.waitForFunction(() => (window as any).__gsnakeContract?.frame);

    const status = await page.evaluate(() => (window as any).__gsnakeContract.frame.state.status);

    const validStatuses = ['Playing', 'GameOver', 'LevelComplete', 'AllComplete'];
    expect(validStatuses).toContain(status);

    // Should be PascalCase (first letter uppercase)
    expect(status[0]).toBe(status[0].toUpperCase());
  });

  test('Frame structure remains consistent across moves', async ({ page }) => {
    await page.goto('/?level=2&contractTest=1');

    await page.waitForFunction(() => (window as any).__gsnakeContract?.frame);

    const frame1 = await page.evaluate(() => (window as any).__gsnakeContract.frame);
    const gridHeight1 = frame1.grid.length;
    const gridWidth1 = frame1.grid[0].length;

    await page.keyboard.press('ArrowDown');

    await page.waitForFunction(
      oldMoves => (window as any).__gsnakeContract?.frame?.state?.moves > oldMoves,
      frame1.state.moves
    );

    const frame2 = await page.evaluate(() => (window as any).__gsnakeContract.frame);

    // Grid dimensions should remain constant
    expect(frame2.grid.length).toBe(gridHeight1);
    expect(frame2.grid[0].length).toBe(gridWidth1);

    // Frame structure should be identical
    expect(Array.isArray(frame2.grid)).toBe(true);
    expect(typeof frame2.state).toBe('object');
    expect(frame2.state).toHaveProperty('status');
    expect(frame2.state).toHaveProperty('moves');
  });

  test('exactly one SnakeHead exists in grid', async ({ page }) => {
    await page.goto('/?level=2&contractTest=1');

    await page.waitForFunction(() => (window as any).__gsnakeContract?.frame);

    const frame = await page.evaluate(() => (window as any).__gsnakeContract.frame);

    let snakeHeadCount = 0;
    frame.grid.forEach((row: string[]) => {
      row.forEach((cell: string) => {
        if (cell === 'SnakeHead') snakeHeadCount++;
      });
    });

    expect(snakeHeadCount).toBe(1);
  });
});
