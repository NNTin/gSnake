export type EntityType =
  | 'snake'
  | 'obstacle'
  | 'food'
  | 'exit'
  | 'stone'
  | 'spike'
  | 'floating-food'
  | 'falling-food';

export type Direction = 'north' | 'south' | 'east' | 'west';

export interface Entity {
  type: EntityType;
  name: string;
  color: string;
}

export interface GridCell {
  row: number;
  col: number;
  entity: EntityType | null;
  isSnakeSegment: boolean; // True if this cell is part of the snake
  snakeSegmentIndex: number | undefined; // Index in the snake array (0 = head)
}
