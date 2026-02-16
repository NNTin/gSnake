import { test, expect } from '@playwright/test';
import { isLevelDefinition, type LevelDefinition } from './level-definition';

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
