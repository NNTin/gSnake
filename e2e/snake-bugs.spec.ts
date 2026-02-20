import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
import type { LevelDefinition } from './level-definition';

type Position = { x: number; y: number };
type SnakeRenderSnapshot = {
  head: Position[];
  body: Position[];
  snake: Position[];
  totalCells: number;
};

const CELL_SELECTOR = '[data-element-id="game-field"] .cell';

async function uploadTestLevel(request: APIRequestContext, levelData: LevelDefinition) {
  const response = await request.post('http://localhost:3001/api/test-level', {
    data: levelData,
    headers: {
      Origin: 'http://localhost:3003'
    }
  });

  expect(response.status()).toBe(200);
}

function sortPositions(positions: Position[]): Position[] {
  return [...positions].sort((a, b) => (a.y - b.y) || (a.x - b.x));
}

async function readRenderedSnake(page: Page, width: number): Promise<SnakeRenderSnapshot> {
  const renderedTypes = await page.$$eval(CELL_SELECTOR, (cells) =>
    cells.map((cell) => {
      const use = cell.querySelector('use');
      const href = use?.getAttribute('href') ?? use?.getAttribute('xlink:href') ?? '';
      return href.startsWith('#') ? href.slice(1) : href;
    })
  );

  const head: Position[] = [];
  const body: Position[] = [];

  renderedTypes.forEach((type, index) => {
    if (type !== 'SnakeHead' && type !== 'SnakeBody') {
      return;
    }

    const coordinate = { x: index % width, y: Math.floor(index / width) };
    if (type === 'SnakeHead') {
      head.push(coordinate);
      return;
    }
    body.push(coordinate);
  });

  const normalizedHead = sortPositions(head);
  const normalizedBody = sortPositions(body);

  return {
    head: normalizedHead,
    body: normalizedBody,
    snake: sortPositions([...normalizedHead, ...normalizedBody]),
    totalCells: renderedTypes.length
  };
}

async function openTestLevel(page: Page, runId: string): Promise<void> {
  await page.goto(`/?test=true&run=${runId}`);
  await expect(page.locator('[data-element-id="game-field"]')).toBeVisible();
  await expect(page.locator(CELL_SELECTOR).first()).toBeVisible();
}

async function expectRenderedSnake(page: Page, levelData: LevelDefinition): Promise<SnakeRenderSnapshot> {
  const snakeHead = levelData.snake[0];
  if (!snakeHead) {
    throw new Error('Fixture level must include at least one snake segment');
  }

  const expectedHead = sortPositions([snakeHead]);
  const expectedBody = sortPositions(levelData.snake.slice(1));

  await expect
    .poll(
      async () => {
        const snapshot = await readRenderedSnake(page, levelData.gridSize.width);
        return {
          head: snapshot.head,
          body: snapshot.body,
          totalCells: snapshot.totalCells
        };
      },
      { timeout: 10000 }
    )
    .toEqual({
      head: expectedHead,
      body: expectedBody,
      totalCells: levelData.gridSize.width * levelData.gridSize.height
    });

  return readRenderedSnake(page, levelData.gridSize.width);
}

test.describe('Snake drawing bug fixes', () => {
  test('renders snake markers and clears stale snake cells after level replacement', async ({ page, request }) => {
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

    await test.step('Upload and render first snake', async () => {
      await uploadTestLevel(request, firstSnake);
      await openTestLevel(page, 'first');
      const firstSnapshot = await expectRenderedSnake(page, firstSnake);
      expect(firstSnapshot.snake).toEqual(sortPositions(firstSnake.snake));
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

    await test.step('Upload second snake and ensure stale cells are cleared', async () => {
      await uploadTestLevel(request, secondSnake);
      await openTestLevel(page, 'second');

      const secondSnapshot = await expectRenderedSnake(page, secondSnake);
      expect(secondSnapshot.snake).toEqual(sortPositions(secondSnake.snake));

      for (const staleSegment of firstSnake.snake) {
        expect(secondSnapshot.snake).not.toContainEqual(staleSegment);
      }
    });
  });
});
