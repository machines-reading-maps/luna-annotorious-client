<script type="ts">
  import { createEventDispatcher } from 'svelte';
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
    
    transcriptions = bodies.filter(body => !body.purpose || body.purpose === 'transcribing');
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

<div class="r8s-hover-container" 
  style={`top: ${originalEvent.offsetY}px; left: ${originalEvent.offsetX}px`}>
  <div class="r8s-hover-main">
    <div class="r8s-hover-content">
      <Transcriptions
        data={transcriptions} 
        on:addTranscription={onAddTranscription} />
    </div>
  </div>

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
    min-width: 240px;
    max-width: 460px;
  }

  .r8s-hover-main {
    display: flex;
    color: #333;
    padding: 14px;
    border-radius: 3px;
    background-color: #fff;
    border: 1px solid #cbccce;
    box-shadow:0 0 24px rgba(0, 0, 0, 0.1);
    z-index: 1;
    width: 100%;
  }

  .r8s-hover-content {
    flex-grow: 1;
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