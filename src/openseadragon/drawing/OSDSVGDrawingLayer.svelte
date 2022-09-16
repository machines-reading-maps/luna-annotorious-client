<script type="ts">
  import { onMount } from 'svelte';

  import type { Shape } from "@/shapes";
  import OSDSVGOverlay from "./OSDSVGOverlay.svelte.svelte";

  export let viewer: any;
  export let selected: Shape;

  let overlay: any;

  onMount(() => {
    overlay = new OSDSVGOverlay({
      target: viewer.element.querySelector('.openseadragon-canvas'),
      props: {
        viewer,
        selected
      }
    });
  });

  $: overlay && overlay.$set({ viewer, selected });
</script>

