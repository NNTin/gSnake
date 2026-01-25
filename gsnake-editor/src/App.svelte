<script lang="ts">
  import LandingPage from './lib/LandingPage.svelte'
  import GridSizeModal from './lib/GridSizeModal.svelte'
  import EditorLayout from './lib/EditorLayout.svelte'

  let showGridSizeModal = false;
  let showEditor = false;
  let gridWidth = 15;
  let gridHeight = 15;

  function handleCreateNew() {
    showGridSizeModal = true;
  }

  function handleLoadExisting(event: CustomEvent<File>) {
    console.log('Load existing level:', event.detail);
    // TODO: Parse JSON and open editor (US-015)
  }

  function handleGridSizeCancel() {
    showGridSizeModal = false;
  }

  function handleGridSizeCreate(event: CustomEvent<{ width: number; height: number }>) {
    gridWidth = event.detail.width;
    gridHeight = event.detail.height;
    showGridSizeModal = false;
    showEditor = true;
  }
</script>

<main>
  {#if showEditor}
    <EditorLayout {gridWidth} {gridHeight} />
  {:else}
    <LandingPage on:createNew={handleCreateNew} on:loadExisting={handleLoadExisting} />

    {#if showGridSizeModal}
      <GridSizeModal on:cancel={handleGridSizeCancel} on:create={handleGridSizeCreate} />
    {/if}
  {/if}
</main>

<style>
  main {
    padding: 0;
    margin: 0;
  }
</style>
