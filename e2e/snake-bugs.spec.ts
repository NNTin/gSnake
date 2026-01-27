import { test, expect, APIRequestContext } from '@playwright/test';

type Position = { x: number; y: number };

type LevelDefinition = {
  id: number;
  name: string;
  gridSize: { width: number; height: number };
  snake: Position[];
  obstacles: Position[];
  food: Position[];
  exit: Position;
  snakeDirection: 'North' | 'South' | 'East' | 'West';
  floatingFood?: Position[];
  fallingFood?: Position[];
  stones?: Position[];
  spikes?: Position[];
  totalFood: number;
};

async function uploadTestLevel(request: APIRequestContext, levelData: LevelDefinition) {
  const response = await request.post('http://localhost:3001/api/test-level', {
    data: levelData,
    headers: {
      Origin: 'http://localhost:3003'
    }
  });

  expect(response.status()).toBe(200);
}

async function fetchTestLevel(request: APIRequestContext) {
  const response = await request.get('http://localhost:3001/api/test-level', {
    headers: {
      Origin: 'http://localhost:3000'
    }
  });

  expect(response.status()).toBe(200);
  return (await response.json()) as LevelDefinition;
}

test.describe('Snake drawing bug fixes', () => {
  test('snake appears on first draw and clears on second draw', async ({ request }) => {
    const firstSnake: LevelDefinition = {
      id: 999999,
      name: 'Test Level - First Snake',
      gridSize: { width: 15, height: 15 },
      snake: [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
        { x: 5, y: 7 }
      ],
      obstacles: [],
      food: [{ x: 8, y: 8 }],
      exit: { x: 12, y: 12 },
      snakeDirection: 'East',
      floatingFood: [],
      fallingFood: [],
      stones: [],
      spikes: [],
      totalFood: 1
    };

    await test.step('Upload initial snake', async () => {
      await uploadTestLevel(request, firstSnake);
      const testLevel = await fetchTestLevel(request);
      expect(testLevel.snake.length).toBe(3);
    });

    const secondSnake: LevelDefinition = {
      id: 999999,
      name: 'Test Level - Second Snake',
      gridSize: { width: 15, height: 15 },
      snake: [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 },
        { x: 10, y: 13 },
        { x: 10, y: 14 }
      ],
      obstacles: [],
      food: [{ x: 8, y: 8 }],
      exit: { x: 12, y: 12 },
      snakeDirection: 'South',
      floatingFood: [],
      fallingFood: [],
      stones: [],
      spikes: [],
      totalFood: 1
    };

    await test.step('Upload new snake and ensure old snake is cleared', async () => {
      await uploadTestLevel(request, secondSnake);
      const testLevel = await fetchTestLevel(request);

      expect(testLevel.snake.length).toBe(5);
      expect(testLevel.snake[0].x).toBe(10);
      expect(testLevel.snake[0].y).toBe(10);

      const hasOldSnake = testLevel.snake.some(seg => seg.x === 5 && seg.y === 5);
      expect(hasOldSnake).toBe(false);
    });

    await test.step('Snake data structure is valid', async () => {
      const testLevel = await fetchTestLevel(request);
      const validSnake = testLevel.snake.every(seg =>
        typeof seg.x === 'number' &&
        typeof seg.y === 'number' &&
        Number.isFinite(seg.x) &&
        Number.isFinite(seg.y)
      );

      expect(validSnake).toBe(true);
    });
  });
});
