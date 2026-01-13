<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import { GameEngine } from '../engine/GameEngine';
  import { KeyboardHandler } from '../engine/KeyboardHandler';
  import { connectGameEngineToStores } from '../stores/stores';
  import GameContainer from './GameContainer.svelte';
  import levelsData from '../data/levels.json';
  import type { Level } from '../types';

  const gameEngine = new GameEngine();
  setContext('GAME_ENGINE', gameEngine);

  let keyboardHandler: KeyboardHandler;

  onMount(() => {
    // Initialize engine with levels
    // Type assertion needed because JSON import is treated as generic object by TS sometimes
    const levels = levelsData as unknown as Level[];
    
    gameEngine.init(levels);
    connectGameEngineToStores(gameEngine);

    keyboardHandler = new KeyboardHandler(gameEngine);
    keyboardHandler.attach();

    return () => {
      if (keyboardHandler) {
        keyboardHandler.detach();
      }
    };
  });
</script>

<GameContainer />

<style>
  /* Global styles are in app.css, component specific styles here if needed */
</style>