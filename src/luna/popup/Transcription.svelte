<script type="ts">
  import { tick, createEventDispatcher } from 'svelte';
  import autosizeInput from 'autosize-input';

  const dispatch = createEventDispatcher();

  /** Props **/
  export let value: string;
  export let editable: boolean;

  /** Derived **/
  $: {
    if (editable) {
      tick().then(() => {
        autosizeInput(inputEl);
        inputEl.focus();
      });
    }
  }

  let inputEl: HTMLInputElement;

  const onSave = (evt: Event) => {
    evt.preventDefault();
    dispatch('change', inputEl.value);
  }
</script>

<div>
  {#if editable}
    <form on:submit={onSave}>
      <input bind:this={inputEl} value={value} spellcheck={false} />
    </form>
  {:else}
    <span class="transcription">{value}</span>
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

  .transcription {
    padding: 3px 4px;
    display: inline-block;
  }
</style>