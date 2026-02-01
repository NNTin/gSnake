import { test, expect } from '@playwright/test';

type LevelDefinition = {
  id: number;
  name: string;
  gridSize: { width: number; height: number };
  snake: { x: number; y: number }[];
  obstacles: { x: number; y: number }[];
  food: { x: number; y: number }[];
  exit: { x: number; y: number };
  snakeDirection: 'North' | 'South' | 'East' | 'West';
  floatingFood?: { x: number; y: number }[];
  fallingFood?: { x: number; y: number }[];
  stones?: { x: number; y: number }[];
  spikes?: { x: number; y: number }[];
  totalFood: number;
};

test.describe('Level Editor Workflow (API)', () => {
  test('uploads and fetches test level with correct CORS', async ({ request }) => {
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
      const postResponse = await request.post('http://localhost:3001/api/test-level', {
        data: testLevel,
        headers: {
          Origin: 'http://localhost:3003'
        }
      });

      expect(postResponse.status()).toBe(200);
    });

    let levelData!: LevelDefinition;
    let getHeaders!: Record<string, string>;

    await test.step('Game fetches test level', async () => {
      const getResponse = await request.get('http://localhost:3001/api/test-level', {
        headers: {
          Origin: 'http://localhost:3000'
        }
      });

      expect(getResponse.status()).toBe(200);
      getHeaders = getResponse.headers();
      levelData = (await getResponse.json()) as LevelDefinition;
    });

    await test.step('CORS header is present and correct', async () => {
      const corsHeader = getHeaders['access-control-allow-origin'];
      expect(corsHeader).toBe('http://localhost:3000');
    });

    await test.step('Response data matches test level', async () => {
      expect(levelData.id).toBe(999999);
      expect(levelData.name).toBe('Test Level');
      expect(levelData.totalFood).toBe(1);
    });

    await test.step('CORS allows other localhost ports', async () => {
      const testPorts = [3000, 3003];

      for (const port of testPorts) {
        const response = await request.get('http://localhost:3001/api/test-level', {
          headers: {
            Origin: `http://localhost:${port}`
          }
        });

        expect(response.status()).toBe(200);
        const cors = response.headers()['access-control-allow-origin'];
        expect(cors).toBeTruthy();
      }
    });
  });
});
