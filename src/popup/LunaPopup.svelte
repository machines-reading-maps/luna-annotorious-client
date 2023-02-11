<script type="ts">
  import { createEventDispatcher } from 'svelte';
  import { draggable } from '@neodrag/svelte';
  import Transcriptions from './Transcriptions.svelte';
  import { Env } from '@annotorious/annotorious';
  import type { WebAnnotation } from '@annotorious/formats';

  const dispatch = createEventDispatcher();

  export let annotation: WebAnnotation;

  export let originalEvent: PointerEvent;

  let transcriptions = [];

  $: {
    const bodies = annotation.body ? 
      Array.isArray(annotation.body) ? annotation.body : [ annotation.body ] : [];
      
    transcriptions = bodies.filter(body => 
      (!body.purpose || body.purpose === 'transcribing') && body.creator?.name !== 'mapKurator:post-ocr');
  }

  const onAddTranscription = (evt: CustomEvent<string>) => {
    const bodies = Array.isArray(annotation.body) ? annotation.body : [ annotation.body ];

    const updated = [
      ...bodies,
      {
        type: 'TextualBody',
        purpose: 'transcribing',
        value: evt.detail,
        creator: {
          type: 'Person',
          name: Env.currentUser.id
        },
        created: Env.getCurrentTimeAdjusted()
      }
    ];

    annotation = {
      ...annotation,
      body: updated
    };
    
    dispatch('transcriptionChanged', annotation);
  }
</script>

<div 
  class="r8s-hover-container" 
  style={`top: ${originalEvent.offsetY}px; left: ${originalEvent.offsetX}px`}>

  <div class="r8s-hover-main" use:draggable>
    <div class="r8s-hover-content">
      <Transcriptions
        data={transcriptions} 
        on:addTranscription={onAddTranscription} />
    </div>

    <div class="r8s-hover-alert">
      Transcribed by artificial intelligence. Please help us improve our data 
      by confirming or fixing this transcription.
    </div>
  </div>

  <div class="mousetrap" />
</div>

<style>
  .r8s-hover-container {
    font-family: Arial, Helvetica, sans-serif;
    position: absolute;
    z-index: 999;
    min-width: 240px;
    max-width: 360px;
  }

  .r8s-hover-main {
    color: #333;
    border-radius: 3px;
    background-color: #fff;
    border: 1px solid #cbccce;
    box-shadow:0 0 24px rgba(0, 0, 0, 0.1);
    z-index: 1;
    width: 100%;
    cursor: move;
  }

  .r8s-hover-content {
    padding: 14px;
  }

  .r8s-hover-alert {
    padding: 12px 14px;
    background-color: #ffeba6;
    color: #8f720f;
    border-top: 1px solid #d1b13f59;
    font-size: 13px;
    display: flex;
    align-items: flex-start;
    line-height: 140%;
  }

  :global(.r8s-hover-alert svg) {
    font-size: 18px;
    fill: #8f720f;
    position: relative;
    top: 1px;
    padding-right: 4px;
    flex: 0 0 24px;
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