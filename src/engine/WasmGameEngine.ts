import type { Level, GameEvent, GameEventListener } from '../../types';
import init, { WasmGameEngine as RustEngine, log } from '../../pkg/gsnake_wasm';

/**
 * TypeScript wrapper around the Rust WASM game engine
 * Provides the same interface as the original TypeScript GameEngine
 */
export class WasmGameEngine {
  private wasmEngine: RustEngine | null = null;
  private listeners: GameEventListener[] = [];
  private initialized = false;
  private levels: Level[] = [];
  private currentLevelIndex = 0;

  async init(levels: Level[], startLevel: number = 1): Promise<void> {
    if (this.initialized) {
      console.warn('WasmGameEngine already initialized');
      return;
    }

    // Initialize the WASM module
    await init();
    log('gSnake WASM engine initialized');

    this.levels = levels;
    this.currentLevelIndex = startLevel - 1;

    // Load the first level
    await this.loadLevel(this.currentLevelIndex);

    this.initialized = true;
  }

  private async loadLevel(levelIndex: number): Promise<void> {
    if (levelIndex < 0 || levelIndex >= this.levels.length) {
      throw new Error(`Invalid level index: ${levelIndex}`);
    }

    const level = this.levels[levelIndex];

    // Convert TypeScript Level to match Rust structure
    const rustLevel = {
      grid_size: {
        width: level.gridSize.width,
        height: level.gridSize.height
      },
      snake: {
        segments: level.snake.segments.map((seg: any) => ({ x: seg.x, y: seg.y })),
        direction: level.snake.direction
      },
      obstacles: level.obstacles.map((obs: any) => ({ x: obs.x, y: obs.y })),
      food: level.food.map((f: any) => ({ x: f.x, y: f.y })),
      exit: { x: level.exit.x, y: level.exit.y }
    };

    // Create new WASM engine instance
    this.wasmEngine = new RustEngine(rustLevel);

    // Register frame callback
    this.wasmEngine.onFrame((frame: any) => {
      this.handleFrameUpdate(frame, level);
    });

    // Emit initial events
    this.emitInitialEvents(level);
  }

  private emitInitialEvents(level: Level): void {
    // Emit levelChanged event
    this.emitEvent({
      type: 'levelChanged',
      level: level
    });

    // Get initial frame and emit events
    if (this.wasmEngine) {
      const frame = this.wasmEngine.getFrame();
      this.handleFrameUpdate(frame, level);
    }
  }

  private handleFrameUpdate(frame: any, level: Level): void {
    // Convert Rust frame back to TypeScript format
    const gameState = {
      status: frame.state.status,
      currentLevel: frame.state.current_level,
      moves: frame.state.moves,
      foodCollected: frame.state.food_collected,
      totalFood: frame.state.total_food
    };

    // Emit state changed event
    this.emitEvent({
      type: 'stateChanged',
      state: gameState
    });

    // Calculate snake from level data (WASM doesn't track snake separately)
    const rustLevel = this.wasmEngine!.getLevel();
    const snake = {
      segments: rustLevel.snake.segments,
      direction: rustLevel.snake.direction
    };

    this.emitEvent({
      type: 'snakeChanged',
      snake: snake
    });

    this.emitEvent({
      type: 'gridDirty'
    });

    // Handle level completion
    if (gameState.status === 'LevelComplete') {
      this.handleLevelComplete();
    }
  }

  private async handleLevelComplete(): Promise<void> {
    // Check if there are more levels
    if (this.currentLevelIndex < this.levels.length - 1) {
      // Auto-advance to next level after a short delay
      setTimeout(async () => {
        await this.nextLevel();
      }, 1000);
    }
  }

  processMove(direction: string): void {
    if (!this.wasmEngine) {
      console.error('WASM engine not initialized');
      return;
    }

    // Convert direction to Rust format
    const directionMap: Record<string, string> = {
      'North': 'North',
      'South': 'South',
      'East': 'East',
      'West': 'West'
    };

    const rustDirection = directionMap[direction];
    if (!rustDirection) {
      console.error(`Invalid direction: ${direction}`);
      return;
    }

    try {
      this.wasmEngine.processMove(rustDirection);
    } catch (error) {
      console.error('Error processing move:', error);
    }
  }

  async nextLevel(): Promise<void> {
    if (this.currentLevelIndex >= this.levels.length - 1) {
      console.log('No more levels');
      return;
    }

    this.currentLevelIndex++;
    await this.loadLevel(this.currentLevelIndex);
  }

  async resetLevel(): Promise<void> {
    await this.loadLevel(this.currentLevelIndex);
  }

  addEventListener(listener: GameEventListener): void {
    this.listeners.push(listener);
  }

  private emitEvent(event: GameEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}
