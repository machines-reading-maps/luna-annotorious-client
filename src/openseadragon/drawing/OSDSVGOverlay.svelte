<script type="ts">
  import { onMount } from 'svelte';
  import OpenSeadragon from 'openseadragon';
  import { Store, Selection } from '@/state';
  import EditableRect from '@/tools/rectangle/EditableRect.svelte';
  import { ShapeType, type Shape, type Rectangle} from '@/shapes';

  export let viewer: OpenSeadragon.Viewer;

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

  const screenToImage = (px: number, py: number) => {
    const { x, y } = viewer.viewport.viewerElementToImageCoordinates(new OpenSeadragon.Point(px, py));
    return [x, y];
  }

  const onGrab = () =>
    viewer.setMouseNavEnabled(false);

  const onRelease = () =>
    viewer.setMouseNavEnabled(true);

  const onComplete = (shape: Shape) =>
    Store.update(shape.id, {
      ...shape,
      state: {
        ...shape.state,
        isSelected: false
      }
    });

  onMount(() =>
    viewer.addHandler('update-viewport', updateTransform(viewer)));
  
  // Making TypeScript happy
  const rectangle = (shape: Shape) => shape as Rectangle;
</script>

<svg class="a9s-gl-drawing-pane">
  <g transform={transform}>
    {#each $Selection as selected}
      {#if selected.type === ShapeType.RECTANGLE}
        <EditableRect
          shape={rectangle(selected)} 
          screenToImage={screenToImage} 
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