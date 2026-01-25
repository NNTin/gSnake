<script lang="ts">
  export let gridWidth: number;
  export let gridHeight: number;

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
      <p>Entities will go here (US-005)</p>
    </div>

    <!-- Center canvas area -->
    <div class="canvas-area">
      <div class="grid-container">
        <p>Grid {gridWidth}x{gridHeight} will render here (US-006)</p>
      </div>
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

  .grid-container {
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
</style>
