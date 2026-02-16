import { test, expect } from '@playwright/test';
import { isLevelDefinition, type LevelDefinition } from './level-definition';

test.describe('Complete Level Editor Workflow (API)', () => {
  test('uploads, fetches, and validates level data', async ({ request }) => {
    const testLevel: LevelDefinition = {
      id: 999999,
      name: 'Test Level',
      gridSize: { width: 15, height: 15 },
      snake: [{ x: 5, y: 5 }, { x: 4, y: 5 }],
      obstacles: [{ x: 3, y: 3 }],
      food: [{ x: 8, y: 8 }, { x: 9, y: 9 }],
      exit: { x: 12, y: 12 },
      snakeDirection: 'East',
      floatingFood: [{ x: 6, y: 6 }],
      fallingFood: [],
      stones: [],
      spikes: [],
      totalFood: 3
    };

    await test.step('Upload test level', async () => {
      const uploadResponse = await request.post('http://localhost:3001/api/test-level', {
        data: testLevel,
        headers: {
          Origin: 'http://localhost:3003'
        }
      });

      expect(uploadResponse.status()).toBe(200);
    });

    let levelData!: LevelDefinition;
    let corsHeader: string | undefined;

    await test.step('Fetch test level', async () => {
      const fetchResponse = await request.get('http://localhost:3001/api/test-level', {
        headers: {
          Origin: 'http://localhost:3000'
        }
      });

      expect(fetchResponse.status()).toBe(200);
      corsHeader = fetchResponse.headers()['access-control-allow-origin'];
      levelData = (await fetchResponse.json()) as LevelDefinition;
    });

    await test.step('CORS header matches expected origin', async () => {
      expect(corsHeader).toBe('http://localhost:3000');
    });

    await test.step('Level schema validates', async () => {
      expect(isLevelDefinition(levelData)).toBe(true);
    });

    await test.step('totalFood calculation matches', async () => {
      const expectedTotalFood = levelData.food.length +
        (levelData.floatingFood?.length || 0) +
        (levelData.fallingFood?.length || 0);

      expect(levelData.totalFood).toBe(expectedTotalFood);
    });
  });
});
