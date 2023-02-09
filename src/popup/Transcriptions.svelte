<script>
  import { tick, createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import BsPatchCheckFill from 'svelte-icons-pack/bs/BsPatchCheckFill';
  import FaSolidRobot from 'svelte-icons-pack/fa/FaSolidRobot';
  import * as timeago from 'timeago.js';
  import autosizeInput from 'autosize-input';

  const dispatch = createEventDispatcher();

  export let data;

  let sorted;

  let inputEl;

  let editable = false;

  let best;

  let isOCR;

  let showAllTranscriptions = false;

  $: {
    // The best transcription is the most recent one from a Person. If there
    // is no transcription from a Person, we'll fall back to the original 
    // mapKurator one (type 'Software', name 'mapKurator:ocr'). If there is none,
    // we'll fall back to the first in the list.

    // Sort by timestamp
    sorted = data.slice().sort((a, b) => a.created < b.created ? 1 : -1);

    const byPerson = sorted.filter(body => body.creator?.type === 'Person'); 
    if (byPerson.length > 0) {
      best = byPerson[0];
    } else {
      const byMK = sorted.find(body => body.creator?.type === 'Software' && body.creator?.name === 'mapKurator:ocr');
      if (byMK) {
        best = byMK;
        isOCR = true;
      } else {
        best = sorted.length > 0 ? sorted[0] : null;
      }
    }
  }

  $: {
    if (editable) {
      tick().then(() => {
        autosizeInput(inputEl);
        inputEl.focus();
      });
    }
  }

  const onKeyDown = evt => {
    if (evt.key === 'Enter') {
      const { value } = inputEl;

      if (value !== best?.value)
        dispatch('addTranscription', inputEl.value);

      editable = false;
    } else if (evt.key === 'Escape') {
      editable = false;
    }
  }
</script>

<div class="transcription-container">
  {#if editable}
    <input 
      bind:this={inputEl} 
      value={best?.value} 
      spellcheck={false} 
      on:keydown={onKeyDown}/>
  {:else}
    <span class="transcription">{best?.value}</span> 

    {#if best?.creator?.type === 'Person'}
      <Icon className="verified-transcription" src={BsPatchCheckFill} />
    {/if}
  {/if}

  {#if data.length > 1}
    <p class="transcription-details transcription-count">
      <button 
        class="show-all" 
        on:click={() => showAllTranscriptions = !showAllTranscriptions}>
        + {data.length - 1} more transcriptions 
      </button> · [ <button on:click={() => editable = true} class="add-transcription">Edit</button> ]
    </p>

    {#if showAllTranscriptions}
      <ul class="all-transcriptions" transition:slide={{ duration: 120 }}>
        {#each sorted as body}
          <li>
            {body.value} <span class="transcribed-by">{timeago.format(body.created)} by {#if body.creator?.type === 'Software'}
              <Icon src={FaSolidRobot} /> mapKurator {:else} {body.creator.name} {/if}</span>
          </li>
        {/each}
      </ul>
    {/if}

  {:else}
    <p class="transcription-details transcribed-by">
      Transcribed by {#if isOCR} <Icon src={FaSolidRobot} /> mapKurator {:else} 
        {best?.creator?.name} 
      {/if}  · [ <button class="add-transcription" on:click={() => editable = true}>Edit</button> ]
    </p>
  {/if}
</div>

<style>
  input {
    font-size: 16px;
    padding: 2px 4px;
    outline: none;
    border: 1px solid #4285f4;
    border-radius: 2px;
    background-color: #e0ebff;
    margin-bottom: 4px;
  }

  .transcription {
    font-size: 1.15em;
  }

  :global(svg) {
    fill: #7a7a7a;
  }

  :global(.verified-transcription) {
    fill: green;
    vertical-align: text-top;
  }

  .transcription-details {
    color: #7a7a7a;
    padding: 0;
    margin: 0;
    font-size: 13px;
  }

  .transcribed-by {
    color: #7a7a7a;
    font-size: 13px;
  }

  :global(.transcribed-by svg) {
    font-size: 1.2em;
    vertical-align: text-top;
    position: relative;
    top: -1px;
    padding: 0 1px;
  }

  .transcription-count button,
  .transcription-details button {
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    background: none;
    color: #7a7a7a;
    cursor: pointer;
    font-size: 13px;
  }

  .transcription-count button.add-transcription,
  .transcription-details button.add-transcription {
    color: #3165b9;
  }


  ul.all-transcriptions {
    padding: 10px 0 0 0;
    margin: 0;
    list-style-type: none;
    font-size: 13px;
  }

  li {
    padding: 3px 0;
  }
</style>