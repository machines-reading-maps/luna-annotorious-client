<script lang="ts">
  import { slide } from 'svelte/transition';
  import * as timeago from 'timeago.js';
  import type { LunaPluginOpts } from '../../LunaPluginOpts';
  import type { Transcription } from '../utils';
  import MKLabel from './MKLabel.svelte';

  export let transcriptions: Transcription[];

  export let open: boolean;

  export let opts: LunaPluginOpts;
</script>

{#if open}
  <ul class="all-transcriptions" transition:slide={{ duration: 120 }}>
    {#each transcriptions as body}
      <li>
        {body.value} <span class="transcribed-by">{timeago.format(body.created)} by {#if body.creator?.type === 'Software'}
          <MKLabel opts={opts} transcription={body} /> {:else} {body.creator.name} {/if}</span>
      </li>
    {/each}
  </ul>
{/if}

<style>
  .all-transcriptions {
    list-style-type: none;
    margin: 0;
    padding: 10px 0 0 0;
  }

  li {
    padding: 3px 0;
  }
</style>
