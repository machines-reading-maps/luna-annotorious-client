<script type="ts">
  import { onMount } from 'svelte';
  import OpenSeadragon from 'openseadragon';
  import { Store, Selection } from '@/state';
  import EditableRect from '@/tools/rectangle/EditableRect.svelte';
  import { ShapeType, type Shape, type Rectangle} from '@/shapes';
  import { latLonShapeToImageRegion, imageRegionRectToLanLot } from './transform';

  export let viewer: OpenSeadragon.Viewer;
  export let map: any;

  let transform = null;

  const updateTransform = viewer => () => {
    const viewportBounds = viewer.viewport.viewportToImageRectangle(viewer.viewport.getBounds(true));

    const containerWidth = viewer.viewport.getContainerSize().x;
    const zoom = viewer.viewport.getZoom(true);
    const scale = zoom * containerWidth / viewer.world.getContentFactor();

    const dx = - (viewportBounds.x - map.imageRegion.x) * scale;
    const dy = - (viewportBounds.y - map.imageRegion.y) * scale;

    transform = `translate(${dx}, ${dy}) scale(${scale})`;
  }

  const toImageRegion = (shape: Shape) => { 
    const transformed = latLonShapeToImageRegion(shape, map) as Rectangle;
    return {
      ...transformed,
      geometry: {
        ...transformed.geometry,
        y: transformed.geometry.y - transformed.geometry.h 
      }
    };
  };

  const screenToImage = (px: number, py: number) => {
    const { x, y } = viewer.viewport.viewerElementToImageCoordinates(new OpenSeadragon.Point(px, py));
    return [x, y];
  }

  const onGrab = () =>
    viewer.setMouseNavEnabled(false);

  const onRelease = () =>
    viewer.setMouseNavEnabled(true);

  const onComplete = (shape: Shape) => {
    const transformed = imageRegionRectToLanLot(shape as Rectangle, map);
    Store.update(shape.id, {
      ...transformed,
      state: {
        ...transformed.state,
        isSelected: false
      }
    });
  }

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
          shape={toImageRegion(selected)} 
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