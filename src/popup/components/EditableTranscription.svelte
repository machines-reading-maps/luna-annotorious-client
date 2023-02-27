<script>
  import autosizeInput from 'autosize-input';
  import { createEventDispatcher, tick } from 'svelte';
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import BsPatchCheckFill from 'svelte-icons-pack/bs/BsPatchCheckFill';

  const dispatch = createEventDispatcher();

  export let transcription;

  export let isEditable;

  export let isVerified;

  let inputEl;

  $: {
    if (isEditable) {
      tick().then(() => {
        autosizeInput(inputEl);
        inputEl.focus();
        inputEl.select();
      });
    }
  }

  const onKeyUp = evt => {
    const { value } = inputEl;

    if (evt.key === 'Enter') {
      dispatch('save');
    } else if (evt.key === 'Escape') {
      dispatch('cancel');
    } else {
      dispatch('change', value);
    }
  }
</script>

{#if isEditable}
  <input 
    bind:this={inputEl} 
    value={transcription?.value}
    spellcheck={false} 
    on:keyup={onKeyUp} />
{:else}
  <span on:click class="transcription">{transcription?.value}</span> 

  {#if isVerified}
    <Icon className="verified-mark" src={BsPatchCheckFill} />
  {/if}
{/if}

<style>
  input {
    background-color: var(--bright-blue-white);
    border: 1px solid var(--bright-blue);
    border-radius: 1px;
    font-size: 16px;
    margin-bottom: 0.5em;
    padding: 4px 6px;
    outline: none;
  }

  .transcription {
    font-size: 16px;
  }

  :global(.verified-mark) {
    fill: green;
    height: 16px;
    padding-left: 2px;
    position: relative;
    top: 2px;
    width: 16px;
  }
</style>