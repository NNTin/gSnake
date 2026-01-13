import { GameEngine } from './GameEngine';
import { Direction } from '../types';

export class KeyboardHandler {
  private keyMap: Map<string, Direction>;
  private boundHandler: (event: KeyboardEvent) => void;

  constructor(private gameEngine: GameEngine) {
    this.keyMap = new Map([
      ['ArrowUp', Direction.North],
      ['ArrowDown', Direction.South],
      ['ArrowLeft', Direction.West],
      ['ArrowRight', Direction.East],
      ['w', Direction.North],
      ['s', Direction.South],
      ['a', Direction.West],
      ['d', Direction.East],
      ['W', Direction.North],
      ['S', Direction.South],
      ['A', Direction.West],
      ['D', Direction.East],
    ]);
    this.boundHandler = this.handleKeyPress.bind(this);
  }
  
  handleKeyPress(event: KeyboardEvent): void {
    const direction = this.keyMap.get(event.key);
    // Only handle if it's a game key and engine is ready
    if (direction) {
      if (this.gameEngine.canProcessInput()) {
        event.preventDefault();
        this.gameEngine.processMove(direction);
      } else {
        // Prevent default scrolling even if input is blocked temporarily, 
        // providing a smoother experience
        event.preventDefault();
      }
    }
  }
  
  attach(): void {
    window.addEventListener('keydown', this.boundHandler);
  }
  
  detach(): void {
    window.removeEventListener('keydown', this.boundHandler);
  }
}