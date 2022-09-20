<script type="ts">
  import { onMount } from 'svelte';
  import OpenSeadragon from 'openseadragon';
  import WMTSSVGDrawingOverlay from './WMTSSVGOverlay.svelte';

  export let viewer: OpenSeadragon.Viewer;
  export let map: any;

  let overlay: WMTSSVGDrawingOverlay;

  /**
   * The view transform computes the CSS transform that aligns
   * the SVG layer with the current OpenSeadradgon viewer state.
   */
  const viewTransform = () => {
    const viewportBounds = viewer.viewport.viewportToImageRectangle(viewer.viewport.getBounds(true));

    const containerWidth = viewer.viewport.getContainerSize().x;
    const zoom = viewer.viewport.getZoom(true);
    const scale = zoom * containerWidth / viewer.world.getContentFactor();

    const rotation = viewer.viewport.getRotation();
    const rotationRad = Math.PI * rotation / 180;

    const dx = - (viewportBounds.x - map.imageRegion.x) * scale;
    const dy = - (viewportBounds.y - map.imageRegion.y) * scale;

    let offsetX: number, offsetY: number;

    if (rotationRad > 0 && rotationRad <= Math.PI / 2) {
      offsetX = viewportBounds.height * scale;
      offsetY = 0;
    } else if (rotationRad > Math.PI / 2 && rotationRad <= Math.PI) {
      offsetX = viewportBounds.width * scale;
      offsetY = viewportBounds.height * scale;
    } else if (rotationRad > Math.PI && rotationRad <= Math.PI * 1.5) {
      offsetX = 0;
      offsetY = viewportBounds.width * scale;
    } else {
      offsetX = 0;
      offsetY = 0;
    }

    const tx = offsetX + dx * Math.cos(rotationRad) - dy * Math.sin(rotationRad);
    const ty = offsetY + dx * Math.sin(rotationRad) + dy * Math.cos(rotationRad);

    return `translate(${tx}, ${ty}) scale(${scale}) rotate(${rotation})`;
  }

  /**
   * The screen transform computes the image coordinates that correspond
   * to the given screen pointer coordinates.
   */
  const screenTransform = (px: number, py: number) => {
    const { x, y } = viewer.viewport.viewerElementToImageCoordinates(new OpenSeadragon.Point(px, py));
    return [x, y];
  }

  onMount(() => {
    overlay = new WMTSSVGDrawingOverlay({
      target: viewer.element.querySelector('.openseadragon-canvas'),
      props: {
        viewer,
        viewTransform,
        screenTransform
      }
    });
  });

  $: overlay && overlay.$set({ viewer, viewTransform, screenTransform });
</script>

