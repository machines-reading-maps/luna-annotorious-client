<script>
  import { slide } from 'svelte/transition';
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import FaSolidRobot from 'svelte-icons-pack/fa/FaSolidRobot';
  import * as timeago from 'timeago.js';

  export let transcriptions;

  export let open;
</script>

{#if open}
  <ul class="all-transcriptions" transition:slide={{ duration: 120 }}>
    {#each transcriptions as body}
      <li>
        {body.value} <span class="transcribed-by">{timeago.format(body.created)} by {#if body.creator?.type === 'Software'}
          <Icon src={FaSolidRobot} /> mapKurator {:else} {body.creator.name} {/if}</span>
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
