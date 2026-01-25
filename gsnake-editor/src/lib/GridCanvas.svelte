<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { GridCell, EntityType } from './types';

  export let gridWidth: number;
  export let gridHeight: number;
  export let cells: GridCell[][];

  const CELL_SIZE = 32; // 32x32 pixels per cell
  const GRID_GAP = 1; // 1px gap between cells

  const dispatch = createEventDispatcher<{ cellClick: { row: number; col: number } }>();

  // Entity color map
  const entityColors: Record<EntityType, string> = {
    'snake': '#4caf50',
    'obstacle': '#666',
    'food': '#ff9800',
    'exit': '#2196f3',
    'stone': '#9e9e9e',
    'spike': '#f44336',
    'floating-food': '#ffc107',
    'falling-food': '#ff5722'
  };

  // Calculate total grid dimensions
  $: totalWidth = gridWidth * CELL_SIZE + (gridWidth - 1) * GRID_GAP;
  $: totalHeight = gridHeight * CELL_SIZE + (gridHeight - 1) * GRID_GAP;

  function handleCellClick(row: number, col: number) {
    dispatch('cellClick', { row, col });
  }

  function getCellBackgroundColor(entity: EntityType | null): string {
    return entity ? entityColors[entity] : 'white';
  }
</script>

<div class="grid-wrapper">
  <div
    class="grid"
    style="
      width: {totalWidth}px;
      height: {totalHeight}px;
      gap: {GRID_GAP}px;
      grid-template-columns: repeat({gridWidth}, {CELL_SIZE}px);
    "
  >
    {#each cells as row}
      {#each row as cell}
        <div
          class="cell"
          class:has-entity={cell.entity !== null}
          style="
            width: {CELL_SIZE}px;
            height: {CELL_SIZE}px;
            background-color: {getCellBackgroundColor(cell.entity)};
          "
          data-row={cell.row}
          data-col={cell.col}
          on:click={() => handleCellClick(cell.row, cell.col)}
          on:keydown={(e) => e.key === 'Enter' && handleCellClick(cell.row, cell.col)}
          role="button"
          tabindex="0"
        ></div>
      {/each}
    {/each}
  </div>
</div>

<style>
  .grid-wrapper {
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .grid {
    display: grid;
    background-color: #e0e0e0; /* Background shows as gaps between cells */
  }

  .cell {
    border: 1px solid #ddd;
    box-sizing: border-box;
    cursor: pointer;
    transition: opacity 0.1s;
    position: relative;
  }

  .cell:hover::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.1);
    pointer-events: none;
  }

  .cell:focus {
    outline: 2px solid #2196f3;
    outline-offset: -2px;
  }
</style>
