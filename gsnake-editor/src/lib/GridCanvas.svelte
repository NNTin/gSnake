<script lang="ts">
  export let gridWidth: number;
  export let gridHeight: number;

  const CELL_SIZE = 32; // 32x32 pixels per cell
  const GRID_GAP = 1; // 1px gap between cells

  // Calculate total grid dimensions
  $: totalWidth = gridWidth * CELL_SIZE + (gridWidth - 1) * GRID_GAP;
  $: totalHeight = gridHeight * CELL_SIZE + (gridHeight - 1) * GRID_GAP;

  // Generate grid cells
  $: cells = Array.from({ length: gridHeight }, (_, row) =>
    Array.from({ length: gridWidth }, (_, col) => ({ row, col }))
  );
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
          style="
            width: {CELL_SIZE}px;
            height: {CELL_SIZE}px;
          "
          data-row={cell.row}
          data-col={cell.col}
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
    background-color: white;
    border: 1px solid #ddd;
    box-sizing: border-box;
    cursor: pointer;
    transition: background-color 0.1s;
  }

  .cell:hover {
    background-color: #f5f5f5;
  }
</style>
