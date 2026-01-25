<script lang="ts">
  import EntityPalette from './EntityPalette.svelte';
  import GridCanvas from './GridCanvas.svelte';
  import type { EntityType, GridCell } from './types';

  export let gridWidth: number;
  export let gridHeight: number;

  let selectedEntity: EntityType = 'snake';
  let snakeSegments: { row: number; col: number }[] = []; // Track snake segments in order (head to tail)

  // Initialize grid cells
  $: cells = Array.from({ length: gridHeight }, (_, row) =>
    Array.from({ length: gridWidth }, (_, col) => ({
      row,
      col,
      entity: null as EntityType | null,
      isSnakeSegment: false,
      snakeSegmentIndex: undefined as number | undefined
    }))
  );

  function handleEntitySelect(event: CustomEvent<EntityType>) {
    const previousEntity = selectedEntity;
    selectedEntity = event.detail;

    // If switching away from snake, finalize snake placement
    if (previousEntity === 'snake' && selectedEntity !== 'snake' && snakeSegments.length > 0) {
      console.log(`Finalized snake with ${snakeSegments.length} segments`);
      snakeSegments = [];
    }

    console.log('Selected entity:', selectedEntity);
  }

  function handleCellClick(event: CustomEvent<{ row: number; col: number }>) {
    const { row, col } = event.detail;

    if (selectedEntity === 'snake') {
      // Special handling for snake: add to segments array
      const existingSegmentIndex = snakeSegments.findIndex(
        seg => seg.row === row && seg.col === col
      );

      // If clicking on an existing segment, ignore
      if (existingSegmentIndex !== -1) {
        console.log(`Cell (${row}, ${col}) is already a snake segment`);
        return;
      }

      // Clear any non-snake entity at this position
      if (cells[row][col].entity !== null && cells[row][col].entity !== 'snake') {
        cells[row][col].entity = null;
        cells[row][col].isSnakeSegment = false;
        cells[row][col].snakeSegmentIndex = undefined;
      }

      // Add to snake segments
      snakeSegments.push({ row, col });
      cells[row][col].entity = 'snake';
      cells[row][col].isSnakeSegment = true;
      cells[row][col].snakeSegmentIndex = snakeSegments.length - 1;

      // Trigger reactivity
      cells = cells;
      snakeSegments = snakeSegments;

      console.log(`Added snake segment ${snakeSegments.length - 1} at (${row}, ${col}). Total segments: ${snakeSegments.length}`);
    } else {
      // For other entities, clear any snake segments at this position and place entity
      const segmentIndex = snakeSegments.findIndex(
        seg => seg.row === row && seg.col === col
      );

      if (segmentIndex !== -1) {
        // Remove from snake segments
        snakeSegments.splice(segmentIndex, 1);
        // Update all subsequent segment indices
        for (let i = segmentIndex; i < snakeSegments.length; i++) {
          const seg = snakeSegments[i];
          cells[seg.row][seg.col].snakeSegmentIndex = i;
        }
        snakeSegments = snakeSegments;
      }

      // Place selected entity at clicked cell (replaces existing entity if present)
      cells[row][col].entity = selectedEntity;
      cells[row][col].isSnakeSegment = false;
      cells[row][col].snakeSegmentIndex = undefined;

      // Trigger reactivity
      cells = cells;
      console.log(`Placed ${selectedEntity} at (${row}, ${col})`);
    }
  }

  function handleNewLevel() {
    console.log('New Level clicked');
  }

  function handleLoad() {
    console.log('Load clicked');
  }

  function handleUndo() {
    console.log('Undo clicked');
  }

  function handleRedo() {
    console.log('Redo clicked');
  }

  function handleSnakeDirection() {
    console.log('Snake Direction clicked');
  }

  function handleTest() {
    console.log('Test clicked');
  }

  function handleSave() {
    console.log('Save clicked');
  }
</script>

<div class="editor-container">
  <!-- Top toolbar -->
  <div class="toolbar">
    <button on:click={handleNewLevel}>New Level</button>
    <button on:click={handleLoad}>Load</button>
    <button on:click={handleUndo}>Undo</button>
    <button on:click={handleRedo}>Redo</button>
    <button on:click={handleSnakeDirection}>Snake Direction</button>
    <button on:click={handleTest}>Test</button>
    <button on:click={handleSave}>Save</button>
  </div>

  <!-- Main content area with sidebar and canvas -->
  <div class="main-content">
    <!-- Left sidebar for entity palette -->
    <div class="sidebar">
      <h3>Entity Palette</h3>
      <EntityPalette on:select={handleEntitySelect} />
    </div>

    <!-- Center canvas area -->
    <div class="canvas-area">
      <GridCanvas {gridWidth} {gridHeight} {cells} on:cellClick={handleCellClick} />
    </div>
  </div>
</div>

<style>
  .editor-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  .toolbar {
    display: flex;
    gap: 8px;
    padding: 12px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
    flex-shrink: 0;
  }

  .toolbar button {
    padding: 8px 16px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
  }

  .toolbar button:hover {
    background-color: #e8e8e8;
  }

  .toolbar button:active {
    background-color: #d8d8d8;
  }

  .main-content {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .sidebar {
    width: 200px;
    background-color: #fafafa;
    border-right: 1px solid #ddd;
    padding: 16px;
    overflow-y: auto;
    flex-shrink: 0;
  }

  .sidebar h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
  }

  .canvas-area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    background-color: #e8e8e8;
    padding: 24px;
  }
</style>
