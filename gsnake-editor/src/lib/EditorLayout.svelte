<script lang="ts">
  import EntityPalette from './EntityPalette.svelte';
  import GridCanvas from './GridCanvas.svelte';
  import type { EntityType, GridCell, Direction } from './types';

  export let gridWidth: number;
  export let gridHeight: number;

  let selectedEntity: EntityType = 'snake';
  let snakeSegments: { row: number; col: number }[] = []; // Track snake segments in order (head to tail)
  let snakeDirection: Direction = 'east'; // Default direction is East

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

  // Undo/Redo state management using command pattern
  interface EditorState {
    cells: GridCell[][];
    snakeSegments: { row: number; col: number }[];
    direction: Direction;
  }

  interface Command {
    execute(): void;
    undo(): void;
  }

  let undoStack: Command[] = [];
  let redoStack: Command[] = [];

  // Helper to capture current state
  function captureState(): EditorState {
    return {
      cells: cells.map(row => row.map(cell => ({ ...cell }))),
      snakeSegments: snakeSegments.map(seg => ({ ...seg })),
      direction: snakeDirection
    };
  }

  // Helper to restore state
  function restoreState(state: EditorState) {
    cells = state.cells.map(row => row.map(cell => ({ ...cell })));
    snakeSegments = state.snakeSegments.map(seg => ({ ...seg }));
    snakeDirection = state.direction;
  }

  // Create a command for cell modification
  function createCellModificationCommand(
    beforeState: EditorState,
    afterState: EditorState
  ): Command {
    return {
      execute() {
        restoreState(afterState);
      },
      undo() {
        restoreState(beforeState);
      }
    };
  }

  // Execute a command and add to undo history
  function executeCommand(command: Command) {
    command.execute();
    undoStack.push(command);
    redoStack = []; // Clear redo stack on new action
    undoStack = undoStack; // Trigger reactivity
    redoStack = redoStack; // Trigger reactivity
  }

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

  function handleCellClick(event: CustomEvent<{ row: number; col: number; shiftKey: boolean }>) {
    const { row, col, shiftKey } = event.detail;

    // Capture state before modification
    const beforeState = captureState();

    // If Shift is pressed, remove entity from the cell
    if (shiftKey) {
      if (cells[row][col].entity === null) {
        console.log(`Cell (${row}, ${col}) is already empty, nothing to remove`);
        return;
      }

      // If it's a snake segment, remove it from the segments array
      if (cells[row][col].isSnakeSegment) {
        const segmentIndex = snakeSegments.findIndex(
          seg => seg.row === row && seg.col === col
        );
        if (segmentIndex !== -1) {
          snakeSegments.splice(segmentIndex, 1);
          // Update all subsequent segment indices
          for (let i = segmentIndex; i < snakeSegments.length; i++) {
            const seg = snakeSegments[i];
            cells[seg.row][seg.col].snakeSegmentIndex = i;
          }
          snakeSegments = snakeSegments;
        }
      }

      // Clear the cell
      cells[row][col].entity = null;
      cells[row][col].isSnakeSegment = false;
      cells[row][col].snakeSegmentIndex = undefined;

      // Trigger reactivity
      cells = cells;
      console.log(`Removed entity from (${row}, ${col})`);

      // Capture state after modification and create command
      const afterState = captureState();
      const command = createCellModificationCommand(beforeState, afterState);
      executeCommand(command);
      return;
    }

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

      // Capture state after modification and create command
      const afterState = captureState();
      const command = createCellModificationCommand(beforeState, afterState);
      executeCommand(command);
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

      // Capture state after modification and create command
      const afterState = captureState();
      const command = createCellModificationCommand(beforeState, afterState);
      executeCommand(command);
    }
  }

  function handleNewLevel() {
    console.log('New Level clicked');
  }

  function handleLoad() {
    console.log('Load clicked');
  }

  function handleUndo() {
    if (undoStack.length === 0) {
      console.log('Nothing to undo');
      return;
    }

    const command = undoStack.pop();
    if (command) {
      command.undo();
      redoStack.push(command);
      undoStack = undoStack; // Trigger reactivity
      redoStack = redoStack; // Trigger reactivity
      console.log('Undo performed');
    }
  }

  function handleRedo() {
    if (redoStack.length === 0) {
      console.log('Nothing to redo');
      return;
    }

    const command = redoStack.pop();
    if (command) {
      command.execute();
      undoStack.push(command);
      undoStack = undoStack; // Trigger reactivity
      redoStack = redoStack; // Trigger reactivity
      console.log('Redo performed');
    }
  }

  function handleDirectionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    snakeDirection = target.value as Direction;
    console.log('Snake direction changed to:', snakeDirection);
  }

  function handleTest() {
    console.log('Test clicked');
  }

  function handleSave() {
    console.log('Save clicked');
  }

  // Keyboard shortcut handler for undo/redo
  function handleKeyDown(event: KeyboardEvent) {
    // Check for Ctrl+Z or Cmd+Z (undo)
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      handleUndo();
      return;
    }

    // Check for Ctrl+Y (Windows/Linux redo) or Cmd+Shift+Z (Mac redo)
    if (
      (event.ctrlKey && event.key === 'y') ||
      (event.metaKey && event.shiftKey && event.key === 'z')
    ) {
      event.preventDefault();
      handleRedo();
      return;
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="editor-container">
  <!-- Top toolbar -->
  <div class="toolbar">
    <button on:click={handleNewLevel}>New Level</button>
    <button on:click={handleLoad}>Load</button>
    <button on:click={handleUndo} disabled={undoStack.length === 0}>Undo</button>
    <button on:click={handleRedo} disabled={redoStack.length === 0}>Redo</button>
    <select bind:value={snakeDirection} on:change={handleDirectionChange} class="direction-select">
      <option value="north">North</option>
      <option value="south">South</option>
      <option value="east">East</option>
      <option value="west">West</option>
    </select>
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

  .toolbar button:disabled {
    background-color: #f5f5f5;
    color: #aaa;
    cursor: not-allowed;
    border-color: #e0e0e0;
  }

  .toolbar button:disabled:hover {
    background-color: #f5f5f5;
  }

  .toolbar .direction-select {
    padding: 8px 12px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
  }

  .toolbar .direction-select:hover {
    background-color: #e8e8e8;
  }

  .toolbar .direction-select:focus {
    outline: 2px solid #4caf50;
    outline-offset: 2px;
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
