<script type="ts">
  import { onMount } from 'svelte';
  import { Store, Selection } from '@/state';
  import EditableRect from '@/tools/rectangle/EditableRect.svelte';
  import { ShapeType, type Shape } from '@/shapes';

  export let viewer: OpenSeadragon.Viewer;

  export let viewTransform: Function;
  
  export let screenTransform: Function;

  let transform = null;

  const onUpdateViewport = () => transform = viewTransform();

  const onGrab = () => viewer.setMouseNavEnabled(false);

  const onRelease = () => viewer.setMouseNavEnabled(true);

  const onComplete = (shape: Shape) => Store.setState(shape.id, { isSelected: false });

  onMount(() => {
    viewer.addHandler('update-viewport', onUpdateViewport);

    return () => 
      viewer.removeHandler('update-viewport', onUpdateViewport);
  });
</script>

<svg class="a9s-gl-drawing-pane">
  <g transform={transform}>
    {#each $Selection as selected}
      {#if selected.type === ShapeType.RECTANGLE}
        <EditableRect
          shape={selected} 
          screenTransform={screenTransform} 
          on:grab={onGrab} 
          on:release={onRelease} 
          on:save={({ detail }) => onComplete(detail)} 
          on:cancel={({ detail }) => onComplete(detail)} />
      {/if}
    {/each}
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