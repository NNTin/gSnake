export type Position = { x: number; y: number };

export type LevelDefinition = {
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

export function isLevelDefinition(level: unknown): level is LevelDefinition {
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
