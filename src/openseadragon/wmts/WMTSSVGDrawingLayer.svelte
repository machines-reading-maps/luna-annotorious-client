<script type="ts">
  import { onMount } from 'svelte';
  import type OpenSeadragon from 'openseadragon';
  import WMTSSVGDrawingOverlay from './WMTSSVGOverlay.svelte';

  export let viewer: OpenSeadragon.Viewer;
  export let map: any;

  let overlay: WMTSSVGDrawingOverlay;

  onMount(() => {
    overlay = new WMTSSVGDrawingOverlay({
      target: viewer.element.querySelector('.openseadragon-canvas'),
      props: {
        viewer,
        map
      }
    });
  });

  $: overlay && overlay.$set({ viewer });
</script>

