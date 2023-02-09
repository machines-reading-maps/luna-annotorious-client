<script>
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import BsPatchCheckFill from 'svelte-icons-pack/bs/BsPatchCheckFill';
  import FaSolidRobot from 'svelte-icons-pack/fa/FaSolidRobot';
  import FaSolidUser from 'svelte-icons-pack/fa/FaSolidUser';
  import { tick, createEventDispatcher } from 'svelte';
  import autosizeInput from 'autosize-input';

  const dispatch = createEventDispatcher();

  export let data;

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
    const sorted = data.slice().sort((a, b) => a.created < b.created ? 1 : -1);

    const byPerson = sorted.filter(body => body.creator?.type === 'Person'); 
    if (byPerson.length > 0) {
      best = byPerson[0];
    } else {
      const byMK = sorted.finde(body => body.creator?.type === 'Software' && body.creator?.name === 'mapKurator:ocr');
      if (byMK) {
        best = byMK;
        isOCR = true;
      } else {
        best = sorted.length > 0 ? sorted[0] : null;
      }
    }
  }

  /*
  $: {
    if (editable) {
      tick().then(() => {
        autosizeInput(inputEl);
        inputEl.focus();
      });
    }
  }
  */

  const onEditTranscription = evt => {
    editable = true;
  }

  const onSaveTranscription = evt => {
    evt.preventDefault();
    dispatch('addTranscription', inputEl.value);
  }
</script>

<div class="transcription-container">
  {#if editable}
    <form on:submit={onSaveTranscription}>
      <input bind:this={inputEl} value={best?.value} spellcheck={false} />
    </form>
  {:else}
    <span class="transcription">{best?.value}</span> 

    {#if data.length > 1}
      <p class="transcription-details transcription-count">
        <button on:click={() => showAllTranscriptions = !showAllTranscriptions}>
          + {data.length - 1} more transcriptions 
        </button>
      </p>

      {#if showAllTranscriptions}
        <!-- <Icon src={BsPatchCheckFill} /> -->
        <ul>
          <li>
            <p class="t">
              PARIS <span>7 weeks ago by Katie</span>
            </p>
          </li>

          <li>
            <p class="t">
              Paris <span>8 weeks ago by Valeria</span>
            </p>
          </li>

          <li>
            <p class="t">
              PVRIS <span>9 weeks ago by Rainer</span>
            </p>
          </li>

          <li>
            <p class="t">
              PRIS <span>6 months ago by <Icon src={FaSolidRobot} /> mapKurator</span>
            </p>
          </li>   
        </ul>
      {/if}

    {:else}
      <p class="transcription-details transcribed-by">
        Transcribed by <Icon src={isOCR ? FaSolidRobot : FaSolidUser} /> {best?.creator?.name}   
        <!-- [ <a href="#">Confirm</a> | [ <a href="#">Edit</a> ]   -->
      </p>
    {/if}
  {/if}
</div>

<style>
  input {
    font-size: 16px;
    padding: 2px 3px;
    outline: none;
    border: 1px solid #4285f4;
    border-radius: 2px;
    background-color: #e0ebff;
  }

  :global(svg) {
    fill: #7a7a7a;
  }

  .transcription-details {
    color: #7a7a7a;
    padding: 0 3px;
    margin: 0;
    font-size: 12px;
  }

  :global(.transcribed-by svg) {
    font-size: 13px;
    vertical-align: text-top;
    position: relative;
    top: -1px;
    padding: 0 1px;
  }

  .transcription-count button {
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    background: none;
    color: #7a7a7a;
    cursor: pointer;
  }

  ul {
    padding: 10px 0 0 0;
    margin: 0;
    list-style-type: none;
  }

  li {
    padding: 3px 0;
  }

  .t {
    color: #333;
  }

  .t span {
    color: #7c7c7c;
  }
</style>