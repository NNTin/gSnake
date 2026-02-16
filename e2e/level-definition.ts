import { isLevelDefinition as isGeneratedLevelDefinition } from "../contracts/generated/level-definition-validator";
import type { LevelDefinition } from "../gsnake-web/packages/gsnake-web-app/types/models";

export type { LevelDefinition };

export function isLevelDefinition(level: unknown): level is LevelDefinition {
  return isGeneratedLevelDefinition(level);
}
