export type EntityType =
  | 'snake'
  | 'obstacle'
  | 'food'
  | 'exit'
  | 'stone'
  | 'spike'
  | 'floating-food'
  | 'falling-food';

export interface Entity {
  type: EntityType;
  name: string;
  color: string;
}
