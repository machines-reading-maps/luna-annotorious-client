<script type="ts">
  import { createEventDispatcher } from 'svelte';
  import { draggable } from '@neodrag/svelte';
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import FaSolidRobot from 'svelte-icons-pack/fa/FaSolidRobot';
  import FaTrashAlt from 'svelte-icons-pack/fa/FaTrashAlt';
  import FiChevronDown from 'svelte-icons-pack/fi/FiChevronDown';
  import type { Env } from '@annotorious/annotorious';
  import type { WebAnnotation } from '@annotorious/formats';
  import EditableTranscription from './components/EditableTranscription.svelte';
  import TranscriptionList from './components/TranscriptionList.svelte';
  import DeleteConfirmation from './components/DeleteConfirmation.svelte';
  import { getTranscriptions, getBestTranscription, isOCR } from './utils';

  const dispatch = createEventDispatcher();

  export let annotation: WebAnnotation;

  export let originalEvent: PointerEvent;

  export let env: typeof Env;

  export let readOnly: boolean;

  let isEditable = false;

  let showAllTranscriptions = false;

  let originalAnnotation = annotation;

  let showConfirmDelete = false;

  $: transcriptions = getTranscriptions(originalAnnotation);

  $: bestTranscription = getBestTranscription(transcriptions);

  const onTranscriptionChanged = evt => {
    const bodies = Array.isArray(originalAnnotation.body) ? originalAnnotation.body : [ originalAnnotation.body ];

    const changedTranscription = {
      type: 'TextualBody',
      purpose: 'transcribing',
      value: evt.detail,
      creator: {
        type: 'Person',
        name: env.currentUser.id
      },
      created: env.getCurrentTimeAdjusted()
    };

    annotation = {
      ...originalAnnotation,
      body: [...bodies, changedTranscription ]
    };
  }

  const onSaveEdit = () => {
    dispatch('save', annotation);

    originalAnnotation = annotation;

    isEditable = false;
  }

  const onCancelEdit = () => {
    dispatch('cancel', annotation);
    
    annotation = originalAnnotation;
    
    isEditable = false;
  }

  const onDelete = () => dispatch('delete');

  const makeEditable = () => {
    isEditable = true;

    dispatch('edit');
  }
</script>

<div 
  class="r8s-hover" 
  class:editable={isEditable} use:draggable
  style={`top: ${originalEvent.offsetY}px; left: ${originalEvent.offsetX}px`}>

  <div class="r8s-hover-content">
    <EditableTranscription 
      isEditable={readOnly ? false : isEditable} 
      transcription={bestTranscription}
      on:click={() => showAllTranscriptions = !showAllTranscriptions}
      on:change={onTranscriptionChanged} 
      on:save={onSaveEdit} 
      on:cancel={onCancelEdit} />

      {#if transcriptions.length === 1}
        <p class="transcription-details transcribed-by">
          Transcribed by {#if isOCR(bestTranscription)} <Icon src={FaSolidRobot} /> mapKurator {:else if (bestTranscription.creator?.name)} 
          {bestTranscription.creator?.name} {/if}{#if !readOnly} · [ <button class="add-transcription" on:click={makeEditable}>Edit</button> ]{/if}
        </p>
      {:else if transcriptions.length > 1}
        <p class="transcription-details transcription-count">
          <button 
            class="show-all" 
            class:open={showAllTranscriptions}
            on:click={() => showAllTranscriptions = !showAllTranscriptions}>
            <Icon src={FiChevronDown} /> {transcriptions.length - 1} more transcriptions 
          </button> {#if !readOnly} · [ <button on:click={makeEditable} class="add-transcription">Edit</button> ]{/if}
        </p>

        <TranscriptionList open={showAllTranscriptions} transcriptions={transcriptions} />
      {/if}
  </div>

  {#if isEditable}
    <div class="r8s-hover-buttons">
      <div class="left">
        <button class="delete" on:click={() => showConfirmDelete = true}>
          <Icon src={FaTrashAlt} />
        </button>
      </div>

      <div class="right-slot">
        <button on:click={onCancelEdit} class="cancel">Cancel</button>
        <button on:click={onSaveEdit} class="ok">Save Edits</button>
      </div>
    </div>
  {/if}
</div>

{#if showConfirmDelete}
  <DeleteConfirmation 
    on:cancel={() => showConfirmDelete = false} 
    on:delete={onDelete} />
{/if}

<style>
  .r8s-hover {
    background-color: #fff;
    border: 1px solid var(--lightgrey-border);
    border-radius: var(--border-radius);
    box-shadow:1px 1px 24px rgba(0, 0, 0, 0.65);
    color: var(--darkgrey-font);
    cursor: move;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 0.875em;
    max-width: 460px;
    min-width: 280px;
    position: absolute;
    z-index: 998;
  }

  .r8s-hover.editable {
    border-color: var(--bright-blue);
    box-shadow:1px 1px 24px rgba(0, 0, 0, 0.65), inset 0 0 1px 2px #4285f4;
  }

  .r8s-hover-content {
    padding: 14px;
    position: relative;
  }

  p.transcription-details {
    margin: 0;
    padding: 0.3em 0;
  }

  p.transcription-details button {
    background: none;
    border: none;
    color: var(--bright-blue-darker);
    cursor: pointer;
    font-size: 1em;
    font-weight: 500;
    margin: 0;
    outline: none;
    padding: 0;
  }

  p.transcription-details button.show-all {
    color: var(--lightgrey-font);
  }

  :global(p.transcription-details button.show-all svg) {
    vertical-align: text-top;
    transition: transform 250ms;
  }

  :global(p.transcription-details button.show-all.open svg) {
    transform: rotateZ(180deg);
  }

  .r8s-hover-buttons {
    align-items: center;
    background-color: var(--bright-blue);
    display: flex;
    justify-content: space-between;
    padding: 10px 14px 10px 8px;
  }

  .r8s-hover-buttons button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1em;
    font-weight: 500;
    outline: none;
  }

  .r8s-hover-buttons .delete {
    border-radius: 50%;
    display: block;
    height: 32px;
    padding: 4px;
    width: 32px;
  }

  .r8s-hover-buttons .delete:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  :global(.r8s-hover-buttons .delete svg) {
    fill: #fff;
    font-size: 13px;
    width: 16px;
    height: 16px;
  }

  .r8s-hover-buttons .ok {
    background-color: #fff;
    border-radius: 1px;
    color: var(--bright-blue-darker);
    padding: 5px 10px;
  }

  .r8s-hover-buttons .cancel {
    color: #fff;
    padding: 0 12px;
  }

  .r8s-hover-buttons .cancel:hover {
    text-decoration: underline;
  }
</style>