<script type="ts">
  import { onMount } from 'svelte';
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import BsPencil from 'svelte-icons-pack/bs/BsPencil';

  import { upsertFirst } from '@/formats/w3c';
  import { Store, Selection, type HoverState } from '@/core/state';
  import type { Shape } from '@/core/shapes';
  import HUD from './HUD.svelte';
  import Transcription from './Transcription.svelte';

  /** Props **/
  export let viewer: any;
  export let user: any;
  export let serverTimeDifference: number = 0; 
  export let hover: HoverState;

  /** State **/
  let isHUDOpen = false;
  let isTranscriptionEditable = false;

  const currentTimeAdjusted = () =>
    new Date(Date.now() + serverTimeDifference);

  const onEditShape = () => {
    // Deselect
    $Selection.forEach(shape =>
      Store.setState(shape.id, { isSelected: false }));

    Store.setState(hover.shape.id, { isSelected: true });
  }

  /** Derived **/
  $: transcription = hover.shape.data.body.find(body => body.purpose === 'transcribing')?.value;

  $: {
    /*
    if (transcription || viewportPoint)
      isHUDOpen = false;
      */
  }

  /*
  onMount(() => {
    const onUpdateViewport = () => {
      // Adjust popup position for viewport changes
      const xy = viewer.viewport.viewportToViewerElementCoordinates(viewportPoint);
      offsetX = xy.x;
      offsetY = xy.y;
    }
    
    viewer.addHandler('update-viewport', onUpdateViewport);
    
    return () => viewer.removeHandler('update-viewport', onUpdateViewport);
  });
  */

  const onChangeTranscription = (evt: CustomEvent<string>) => {
    const updated = upsertFirst(hover.shape, {
      type: 'TextualBody',
      purpose: 'transcribing',
      value: evt.detail,
      creator: user,
      created: currentTimeAdjusted()
    });

    Store.update(hover.shape, updated);

    hover = { ...hover, shape: updated };
    isTranscriptionEditable = false;
  }
</script>

<div class="r8s-hover-container" style={`top: ${hover.originalEvent.offsetY}px; left: ${hover.originalEvent.offsetX}px`}>
  <div class="r8s-hover-main">
    <div class="r8s-hover-content">
      <Transcription 
        value={transcription} 
        editable={isTranscriptionEditable}
        on:change={onChangeTranscription} />
    </div>

    <div class="r8s-hover-actions">
      <div class="r8s-hover-action r8s-hover-action-improve">
        <button id="r8s-button-improve" on:click={() => isHUDOpen = !isHUDOpen}>
          <Icon src={BsPencil} />
        </button>
        <label for="r8s-button-improve">Improve our data</label>
      </div>
    </div>
  </div>

  {#if isHUDOpen}
    <HUD 
      on:fixTranscription={() => isTranscriptionEditable = true} 
      on:editShape={onEditShape} />
  {/if}

  <div class="mousetrap" />
</div>

<style>
  .r8s-hover-container {
    font-family: Arial, Helvetica, sans-serif;
    position: absolute;
    z-index: 999;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  .r8s-hover-main {
    display: flex;
    color: #333;
    min-width: 260px;
    padding: 14px;
    border-radius: 3px;
    background-color: #fff;
    border: 1px solid #cbccce;
    box-shadow:0 0 24px rgba(0, 0, 0, 0.1);
    z-index: 1;
  }

  .r8s-hover-content {
    flex-grow: 1;
  }

  .r8s-hover-actions {
    flex-basis: 70px;
    flex-grow: 0;
    flex-shrink: 0;
  }

  .r8s-hover-action-improve {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .r8s-hover-action-improve button {
    outline: none;
    border: none;
    border-radius: 50%;
    background-color: #4285f4;
    width: 46px;
    height: 46px;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .r8s-hover-action-improve button:hover {
    background-color: #68a1ff;
  }

  .r8s-hover-action-improve label {
    padding-top: 5px;
    color: #4285f4;
    text-transform: uppercase;
    font-size: 11px;
    font-weight: bold;
  }

  :global(.r8s-hover-action-improve button svg) {
    fill: #fff;
  }

  .mousetrap {
    position: absolute;
    top: -20px;
    right: -20px;
    left: -20px;
    bottom: -20px;
    z-index: -1;
  }
</style>