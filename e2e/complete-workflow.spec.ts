import { test, expect } from '@playwright/test';

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
  exitIsSolid?: boolean;
  totalFood: number;
  difficulty?: string;
};

const directionValues = new Set(['North', 'South', 'East', 'West']);

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isPosition(value: unknown): value is Position {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Position;
  return isFiniteNumber(candidate.x) && isFiniteNumber(candidate.y);
}

function isPositionArray(value: unknown): value is Position[] {
  return Array.isArray(value) && value.every(item => isPosition(item));
}

function isOptionalPositionArray(value: unknown): value is Position[] | undefined {
  if (value === undefined) return true;
  return isPositionArray(value);
}

function isGridSize(value: unknown): value is { width: number; height: number } {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as { width: number; height: number };
  return isFiniteNumber(candidate.width) && isFiniteNumber(candidate.height);
}

function isLevelDefinition(level: unknown): level is LevelDefinition {
  if (!level || typeof level !== 'object') return false;
  const candidate = level as LevelDefinition;

  if (!isFiniteNumber(candidate.id)) return false;
  if (typeof candidate.name !== 'string') return false;
  if (candidate.difficulty !== undefined && typeof candidate.difficulty !== 'string') return false;
  if (!isGridSize(candidate.gridSize)) return false;
  if (!isPositionArray(candidate.snake)) return false;
  if (!isPositionArray(candidate.obstacles)) return false;
  if (!isPositionArray(candidate.food)) return false;
  if (!isPosition(candidate.exit)) return false;
  if (!directionValues.has(candidate.snakeDirection)) return false;
  if (!isOptionalPositionArray(candidate.floatingFood)) return false;
  if (!isOptionalPositionArray(candidate.fallingFood)) return false;
  if (!isOptionalPositionArray(candidate.stones)) return false;
  if (!isOptionalPositionArray(candidate.spikes)) return false;
  if (candidate.exitIsSolid !== undefined && typeof candidate.exitIsSolid !== 'boolean') return false;
  if (!isFiniteNumber(candidate.totalFood)) return false;

  return true;
}

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
