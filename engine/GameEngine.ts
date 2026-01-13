import type { 
  Level, 
  Grid, 
  GameEventListener, 
  Snake, 
  GameState, 
  GameEvent, 
  Position, 
  GridCache
} from '../types';

import { 
  Direction, 
  CellType, 
  GameStatus
} from '../types';

export class GameEngine {
  private levels: Level[] = [];
  private currentLevelIndex: number = 0;
  private snake: Snake = { segments: [], direction: null };
  private level: Level | null = null;
  private gameState: GameState = {
    status: GameStatus.Playing,
    currentLevel: 1,
    moves: 0,
    foodCollected: 0,
    totalFood: 0
  };
  private isProcessing: boolean = false;
  private listeners: GameEventListener[] = [];
  private gridCache: GridCache = { grid: [], dirty: true };

  init(levels: Level[]): void {
    this.levels = levels;
    if (this.levels.length > 0) {
      this.loadLevel(1);
    }
  }

  processMove(direction: Direction): void {
    if (!this.canProcessInput()) return;
    
    this.isProcessing = true;

    // Prevent 180 degree turns if moving and length > 1
    if (this.isOppositeDirection(direction)) {
      this.isProcessing = false;
      return;
    }

    const head = this.snake.segments[0];
    const newHead = this.getNewHeadPosition(head, direction);
    
    this.snake.direction = direction;

    // 1. Move & Check Food
    const foodIndex = this.getFoodIndex(newHead);
    let justAte = false;

    // Insert new head
    this.snake.segments.unshift(newHead);

    if (foodIndex !== -1) {
      // Eat food: Don't pop tail
      if (this.level) {
        this.level.food.splice(foodIndex, 1);
      }
      this.gameState.foodCollected++;
      justAte = true;
    } else {
      // No food: Pop tail
      this.snake.segments.pop();
    }

    // 2. Apply Gravity
    this.applyGravity();

    // 3. Check Collisions (Game Over)
    const finalHead = this.snake.segments[0];
    if (this.checkCollision(finalHead)) {
      this.gameState.status = GameStatus.GameOver;
    } else {
       // 4. Check Exit (Level Complete)
       if (this.checkExit(finalHead)) {
         if (this.currentLevelIndex < this.levels.length - 1) {
            // Level Complete
            this.gameState.status = GameStatus.LevelComplete;
            // Emit state change before transition?
            // Actually, we can just load the next level immediately as per spec
            // But let's finish this update cycle first so the UI sees the 'win' state if needed, 
            // OR just transition. Spec says "Next level loads instantly".
            // So we'll skip the 'LevelComplete' display state and go straight to next level.
            this.loadLevel(this.gameState.currentLevel + 1);
            return; // loadLevel resets state and emits events
         } else {
           this.gameState.status = GameStatus.AllComplete;
         }
       }
    }

    this.gameState.moves++;
    this.gridCache.dirty = true;
    
    this.emitStateChange();
    this.emitSnakeChange();
    this.emitGridDirty();

    // Unlock input
    this.isProcessing = false; 
  }

  restartLevel(): void {
    this.loadLevel(this.gameState.currentLevel);
  }

  loadLevel(levelNumber: number): void {
    const index = levelNumber - 1;
    if (index < 0 || index >= this.levels.length) {
      console.error(`Level ${levelNumber} not found`);
      return;
    }

    this.currentLevelIndex = index;
    // Deep copy level data
    this.level = JSON.parse(JSON.stringify(this.levels[index]));
    
    if (this.level) {
        this.snake = {
            segments: [...this.level.snake],
            direction: null
        };
        
        this.gameState = {
            status: GameStatus.Playing,
            currentLevel: levelNumber,
            moves: 0,
            foodCollected: 0,
            totalFood: this.level.food.length
        };
    }

    this.gridCache.dirty = true;
    this.isProcessing = false;

    this.emitLevelChange();
    this.emitSnakeChange();
    this.emitStateChange();
    this.emitGridDirty();
  }

  addEventListener(listener: GameEventListener): void {
    this.listeners.push(listener);
  }

  removeEventListener(listener: GameEventListener): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  canProcessInput(): boolean {
    return !this.isProcessing && this.gameState.status === GameStatus.Playing;
  }
  
  public getGrid(): Grid {
    if (this.gridCache.dirty) {
        this.gridCache.grid = this.computeGrid();
        this.gridCache.dirty = false;
    }
    return this.gridCache.grid;
  }

  // --- Private Helpers ---

  private emit(event: GameEvent): void {
    this.listeners.forEach(l => l(event));
  }

  private emitStateChange() { this.emit({ type: 'stateChanged', state: { ...this.gameState } }); }
  private emitSnakeChange() { this.emit({ type: 'snakeChanged', snake: { ...this.snake } }); }
  private emitLevelChange() { if(this.level) this.emit({ type: 'levelChanged', level: { ...this.level } }); }
  private emitGridDirty() { this.emit({ type: 'gridDirty' }); }

  private getNewHeadPosition(head: Position, direction: Direction): Position {
    switch (direction) {
        case Direction.North: return { x: head.x, y: head.y - 1 };
        case Direction.South: return { x: head.x, y: head.y + 1 };
        case Direction.East: return { x: head.x + 1, y: head.y };
        case Direction.West: return { x: head.x - 1, y: head.y };
    }
  }

  private isOppositeDirection(newDir: Direction): boolean {
    const currentDir = this.snake.direction;
    if (!currentDir) return false;
    if (newDir === Direction.North && currentDir === Direction.South) return true;
    if (newDir === Direction.South && currentDir === Direction.North) return true;
    if (newDir === Direction.East && currentDir === Direction.West) return true;
    if (newDir === Direction.West && currentDir === Direction.East) return true;
    return false;
  }

  private getFoodIndex(pos: Position): number {
    if (!this.level) return -1;
    return this.level.food.findIndex(f => f.x === pos.x && f.y === pos.y);
  }

  private applyGravity(): void {
    // Falls until ANY segment hits an obstacle/floor
    while (this.canSnakeFall()) {
        for (const segment of this.snake.segments) {
            segment.y += 1;
        }
    }
  }

  private canSnakeFall(): boolean {
    if (!this.level) return false;
    
    for (const segment of this.snake.segments) {
        const nextY = segment.y + 1;
        const nextX = segment.x;

        // Check Floor
        if (nextY >= this.level.gridSize.height) return false;

        // Check Obstacles
        if (this.isObstacle({ x: nextX, y: nextY })) return false;
    }
    return true;
  }

  private isObstacle(pos: Position): boolean {
      if (!this.level) return false;
      return this.level.obstacles.some(o => o.x === pos.x && o.y === pos.y);
  }

  private checkCollision(head: Position): boolean {
    if (!this.level) return false;

    // 1. Out of Bounds
    if (head.x < 0 || head.x >= this.level.gridSize.width ||
        head.y < 0 || head.y >= this.level.gridSize.height) {
        return true;
    }

    // 2. Obstacles
    if (this.isObstacle(head)) return true;

    // 3. Self Collision (Body)
    // Check all other segments
    for (let i = 1; i < this.snake.segments.length; i++) {
        if (this.snake.segments[i].x === head.x && 
            this.snake.segments[i].y === head.y) {
            return true;
        }
    }

    return false;
  }

  private checkExit(head: Position): boolean {
    if (!this.level) return false;
    
    // Check if head is on exit
    if (head.x === this.level.exit.x && head.y === this.level.exit.y) {
        // Must collect all food
        return this.gameState.foodCollected === this.gameState.totalFood;
    }
    return false;
  }

  private computeGrid(): Grid {
    if (!this.level) return [];
    
    const width = this.level.gridSize.width;
    const height = this.level.gridSize.height;
    
    // Initialize empty grid
    const grid: Grid = Array(height).fill(null).map(() => Array(width).fill(CellType.Empty));
    
    // Place Obstacles
    this.level.obstacles.forEach(pos => {
        if (this.isInBounds(pos, width, height)) grid[pos.y][pos.x] = CellType.Obstacle;
    });

    // Place Exit
    const exit = this.level.exit;
    if (this.isInBounds(exit, width, height)) grid[exit.y][exit.x] = CellType.Exit;

    // Place Food
    this.level.food.forEach(pos => {
        if (this.isInBounds(pos, width, height)) grid[pos.y][pos.x] = CellType.Food;
    });

    // Place Snake
    // Draw body first
    this.snake.segments.forEach((pos, index) => {
        if (this.isInBounds(pos, width, height)) {
            // Head is index 0
            if (index === 0) {
               grid[pos.y][pos.x] = CellType.SnakeHead;
            } else {
               // Don't overwrite head if overlapping (which shouldn't happen unless collision)
               if (grid[pos.y][pos.x] !== CellType.SnakeHead) {
                  grid[pos.y][pos.x] = CellType.SnakeBody;
               }
            }
        }
    });

    return grid;
  }

  private isInBounds(pos: Position, width: number, height: number): boolean {
      return pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height;
  }
}