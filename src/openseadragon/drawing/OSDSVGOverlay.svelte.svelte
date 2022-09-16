<script type="ts">
  import { onMount } from 'svelte';
  import OpenSeadragon from 'openseadragon';

  export let viewer: any;
  export let selected: any;

  let transform = null;

  const updateTransform = viewer => () => {
    const containerWidth = viewer.viewport.getContainerSize().x;
    const zoom = viewer.viewport.getZoom(true);
    const flipped = viewer.viewport.getFlip();

    const p = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(0, 0), true);
    if (flipped)
      p.x = viewer.viewport._containerInnerSize.x - p.x;

    const scaleY = zoom * containerWidth / viewer.world.getContentFactor();
    const scaleX = flipped ? - scaleY : scaleY;
    const rotation = viewer.viewport.getRotation();

    transform = `translate(${p.x}, ${p.y}) scale(${scaleX}, ${scaleY}) rotate(${rotation})`;
  }

  onMount(() =>
    viewer.addHandler('update-viewport', updateTransform(viewer)));
</script>

<svg class="a9s-gl-drawing-pane">
  <g transform={transform}>
    {#if selected}
      <rect 
        x={selected.geometry.x}
        y={selected.geometry.y}
        width={selected.geometry.w}
        height={selected.geometry.h} />
    {/if}
  </g>
</svg>

<style>
  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    outline: none;
  }
</style>