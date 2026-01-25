<script lang="ts">
  import LandingPage from './lib/LandingPage.svelte'

  let showGridSizeModal = false;

  function handleCreateNew() {
    showGridSizeModal = true;
  }

  function handleLoadExisting(event: CustomEvent<File>) {
    console.log('Load existing level:', event.detail);
  }
</script>

<main>
  <LandingPage on:createNew={handleCreateNew} on:loadExisting={handleLoadExisting} />

  {#if showGridSizeModal}
    <div class="modal-overlay">
      <div class="modal">
        <p>Grid size modal - to be implemented in US-003</p>
        <button on:click={() => showGridSizeModal = false}>Close</button>
      </div>
    </div>
  {/if}
</main>

<style>
  main {
    padding: 0;
    margin: 0;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
