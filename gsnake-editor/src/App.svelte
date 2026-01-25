<script lang="ts">
  import LandingPage from './lib/LandingPage.svelte'
  import GridSizeModal from './lib/GridSizeModal.svelte'

  let showGridSizeModal = false;

  function handleCreateNew() {
    showGridSizeModal = true;
  }

  function handleLoadExisting(event: CustomEvent<File>) {
    console.log('Load existing level:', event.detail);
  }

  function handleGridSizeCancel() {
    showGridSizeModal = false;
  }

  function handleGridSizeCreate(event: CustomEvent<{ width: number; height: number }>) {
    console.log('Create level with dimensions:', event.detail);
    showGridSizeModal = false;
    // TODO: Open editor with specified dimensions (US-004)
  }
</script>

<main>
  <LandingPage on:createNew={handleCreateNew} on:loadExisting={handleLoadExisting} />

  {#if showGridSizeModal}
    <GridSizeModal on:cancel={handleGridSizeCancel} on:create={handleGridSizeCreate} />
  {/if}
</main>

<style>
  main {
    padding: 0;
    margin: 0;
  }
</style>
