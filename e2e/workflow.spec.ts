import { test, expect } from '@playwright/test';
import { isLevelDefinition, type LevelDefinition } from './level-definition';

const TEST_LEVEL_ENDPOINT = 'http://localhost:3001/api/test-level';
const GAME_ORIGIN = 'http://localhost:3000';
const EDITOR_ORIGIN = 'http://localhost:3003';

test.describe('Level Editor Workflow (API)', () => {
  test('uploads and fetches test level with contract checks', async ({ request }) => {
    const testLevel: LevelDefinition = {
      id: 999999,
      name: 'Test Level',
      gridSize: { width: 10, height: 10 },
      snake: [{ x: 5, y: 5 }],
      obstacles: [],
      food: [{ x: 3, y: 3 }],
      exit: { x: 8, y: 8 },
      snakeDirection: 'East',
      floatingFood: [],
      fallingFood: [],
      stones: [],
      spikes: [],
      totalFood: 1
    };

    await test.step('Editor uploads test level', async () => {
      const postResponse = await request.post(TEST_LEVEL_ENDPOINT, {
        data: testLevel,
        headers: {
          Origin: EDITOR_ORIGIN
        }
      });

      expect(postResponse.status()).toBe(200);
    });

    let levelData!: LevelDefinition;
    let getHeaders!: Record<string, string>;

    await test.step('Game fetches test level', async () => {
      const getResponse = await request.get(TEST_LEVEL_ENDPOINT, {
        headers: {
          Origin: GAME_ORIGIN
        }
      });

      expect(getResponse.status()).toBe(200);
      getHeaders = getResponse.headers();

      const payload = await getResponse.json();
      expect(isLevelDefinition(payload)).toBe(true);
      levelData = payload as LevelDefinition;
    });

    await test.step('CORS header is present and correct', async () => {
      const corsHeader = getHeaders['access-control-allow-origin'];
      expect(corsHeader).toBe(GAME_ORIGIN);
    });

    await test.step('Response data matches uploaded level', async () => {
      expect(levelData.id).toBe(999999);
      expect(levelData.name).toBe('Test Level');
      expect(levelData.totalFood).toBe(1);
    });

    await test.step('totalFood matches combined food counts', async () => {
      const expectedTotalFood = levelData.food.length +
        (levelData.floatingFood?.length || 0) +
        (levelData.fallingFood?.length || 0);

      expect(levelData.totalFood).toBe(expectedTotalFood);
    });

    await test.step('CORS allows other localhost ports', async () => {
      const testOrigins = [GAME_ORIGIN, EDITOR_ORIGIN];

      for (const origin of testOrigins) {
        const response = await request.get(TEST_LEVEL_ENDPOINT, {
          headers: {
            Origin: origin
          }
        });

        expect(response.status()).toBe(200);
        const cors = response.headers()['access-control-allow-origin'];
        expect(cors).toBeTruthy();
      }
    });
  });
});
