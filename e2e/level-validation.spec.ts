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

test.describe('Level Validation', () => {
  test('level without totalFood is rejected', async () => {
    const levelWithoutTotalFood = {
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
      spikes: []
    };

    expect(isLevelDefinition(levelWithoutTotalFood)).toBe(false);
  });

  test('level with totalFood is accepted', async () => {
    const levelWithTotalFood: LevelDefinition = {
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

    expect(isLevelDefinition(levelWithTotalFood)).toBe(true);
  });

  test('level with multiple food types is accepted', async () => {
    const levelWithMultipleFoodTypes: LevelDefinition = {
      id: 999999,
      name: 'Test Level',
      gridSize: { width: 10, height: 10 },
      snake: [{ x: 5, y: 5 }],
      obstacles: [],
      food: [{ x: 3, y: 3 }, { x: 4, y: 4 }],
      exit: { x: 8, y: 8 },
      snakeDirection: 'East',
      floatingFood: [{ x: 2, y: 2 }],
      fallingFood: [{ x: 6, y: 6 }],
      stones: [],
      spikes: [],
      totalFood: 4
    };

    expect(isLevelDefinition(levelWithMultipleFoodTypes)).toBe(true);
  });
});
