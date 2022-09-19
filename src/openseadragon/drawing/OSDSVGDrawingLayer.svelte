<script type="ts">
  import { onMount } from 'svelte';
  import type OpenSeadragon from 'openseadragon';
  import OSDSVGOverlay from './OSDSVGOverlay.svelte.svelte';

  export let viewer: OpenSeadragon.Viewer;

  let overlay: OSDSVGOverlay;

  onMount(() => {
    overlay = new OSDSVGOverlay({
      target: viewer.element.querySelector('.openseadragon-canvas'),
      props: {
        viewer
      }
    });
  });

  $: overlay && overlay.$set({ viewer });
</script>

