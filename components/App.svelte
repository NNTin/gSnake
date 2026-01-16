<script lang="ts">
  import { onMount, onDestroy, setContext } from 'svelte';
  import { WasmGameEngine } from '../engine/WasmGameEngine';
  import { KeyboardHandler } from '../engine/KeyboardHandler';
  import { connectGameEngineToStores } from '../stores/stores';
  import GameContainer from './GameContainer.svelte';
  import levelsData from '../data/levels.json';
  import type { Level } from '../types';

  const gameEngine = new WasmGameEngine();
  setContext('GAME_ENGINE', gameEngine);

  let keyboardHandler: KeyboardHandler;

  onMount(async () => {
    // Initialize engine with levels
    // Type assertion needed because JSON import is treated as generic object by TS sometimes
    const levels = levelsData as unknown as Level[];
    
    // Parse URL param for start level
    const urlParams = new URLSearchParams(window.location.search);
    const startLevel = parseInt(urlParams.get('level') || '1', 10);
    
    // Connect stores BEFORE init so we catch the initial events
    connectGameEngineToStores(gameEngine);
    await gameEngine.init(levels, startLevel);

    // @ts-ignore - Temporary ignore until KeyboardHandler is updated
    keyboardHandler = new KeyboardHandler(gameEngine);
    keyboardHandler.attach();
  });

  onDestroy(() => {
    if (keyboardHandler) {
      keyboardHandler.detach();
    }
  });
</script>

<GameContainer />

<style>
  /* Global styles are in app.css, component specific styles here if needed */
</style>
