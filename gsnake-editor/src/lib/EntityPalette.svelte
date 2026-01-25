<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { EntityType, Entity } from './types';

  const entities: Entity[] = [
    { type: 'snake', name: 'Snake', color: '#4caf50' },
    { type: 'obstacle', name: 'Obstacle', color: '#666' },
    { type: 'food', name: 'Food', color: '#ff9800' },
    { type: 'exit', name: 'Exit', color: '#2196f3' },
    { type: 'stone', name: 'Stone', color: '#9e9e9e' },
    { type: 'spike', name: 'Spike', color: '#f44336' },
    { type: 'floating-food', name: 'Floating Food', color: '#ffc107' },
    { type: 'falling-food', name: 'Falling Food', color: '#ff5722' },
  ];

  let selectedEntity: EntityType = 'snake';

  const dispatch = createEventDispatcher<{ select: EntityType }>();

  function selectEntity(entityType: EntityType) {
    selectedEntity = entityType;
    dispatch('select', entityType);
  }
</script>

<div class="entity-palette">
  {#each entities as entity}
    <button
      class="entity-item"
      class:selected={selectedEntity === entity.type}
      style="--entity-color: {entity.color}"
      on:click={() => selectEntity(entity.type)}
    >
      <div class="entity-icon" style="background-color: {entity.color}"></div>
      <span class="entity-name">{entity.name}</span>
    </button>
  {/each}
</div>

<style>
  .entity-palette {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .entity-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    background-color: #fff;
    border: 2px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    font-size: 14px;
  }

  .entity-item:hover {
    background-color: #f0f0f0;
  }

  .entity-item.selected {
    border-color: var(--entity-color);
    background-color: #f5f5f5;
  }

  .entity-icon {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .entity-name {
    flex: 1;
    font-weight: 500;
  }
</style>
