<script lang="ts">
  import { onMount, afterUpdate, createEventDispatcher } from 'svelte';
  import OpenSeadragon from 'openseadragon';
  import * as PIXI from 'pixi.js';
  import { Store } from '@/state';
  import type { Shape } from '@/shapes';

  const dispatch = createEventDispatcher();

  // OpenSeadragon viewer
  export let viewer: any;

  // Current selection
  export let selected: Shape;
  
  // AnnotationLayer config
  export let config: {
    drawShape:Function,
    viewportToLayerPoint: Function,
    viewportToLayerDelta: Function
  };

  // Pixi stage
  const graphics = new PIXI.Graphics();

  // Pixi renderer - initialized on mount
  let renderer: PIXI.AbstractRenderer; 

  // Lookup table: rendered graphics objects by shape ID
  let renderedObjects = {}; 

  // Objects currently removed due to selection
  let removedObjects = [];

  // Current mouse hover state
  let currentHover: Shape | null;

  const drawShape = (shape: Shape) => {
    const g = config.drawShape(shape);
    graphics.addChild(g);
    renderedObjects[shape.id] = g;
  }

  const refresh = () => {
    const viewportBounds = viewer.viewport.viewportToImageRectangle(viewer.viewport.getBounds(true));

    const containerWidth = viewer.viewport.getContainerSize().x;
    const zoom = viewer.viewport.getZoom(true);
    const scale = zoom * containerWidth / viewer.world.getContentFactor();

    const { dx, dy } = config.viewportToLayerDelta(viewportBounds, scale);

    const rotation = Math.PI * viewer.viewport.getRotation() / 180;

    let offsetX: number, offsetY: number;

    if (rotation > 0 && rotation <= Math.PI / 2) {
      offsetX = viewportBounds.height * scale;
      offsetY = 0;
    } else if (rotation > Math.PI / 2 && rotation <= Math.PI) {
      offsetX = viewportBounds.width * scale;
      offsetY = viewportBounds.height * scale;
    } else if (rotation > Math.PI && rotation <= Math.PI * 1.5) {
      offsetX = 0;
      offsetY = viewportBounds.width * scale;
    } else {
      offsetX = 0;
      offsetY = 0;
    }

    graphics.position.x = offsetX + dx * Math.cos(rotation) - dy * Math.sin(rotation);
    graphics.position.y = offsetY + dx * Math.sin(rotation) + dy * Math.cos(rotation);

    graphics.scale.set(scale, scale);
    graphics.rotation = rotation;
    
    renderer.render(graphics);
  };

  onMount(() => {
    const { offsetWidth, offsetHeight } = viewer.canvas;

    const canvas = document.createElement('canvas');
    canvas.width = offsetWidth;
    canvas.height = offsetHeight;
    canvas.className = 'a9s-gl-canvas';

    viewer.element.querySelector('.openseadragon-canvas').appendChild(canvas);

    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      canvas.width = width;
      canvas.height = height;
      renderer.render(graphics);
    });

    observer.observe(canvas);

    new OpenSeadragon.MouseTracker({
      element: viewer.container,

      moveHandler: evt => {
        const vpt = viewer.viewport.pointFromPixel(evt.position);
        const img = config.viewportToLayerPoint(vpt, viewer);

        const hovered = Store.getAt(img.x, img.y);

        if (hovered !== currentHover) {
          const { originalEvent } = evt;
          if (currentHover) {
            dispatch('leaveShape', { shape: currentHover, originalEvent, viewportPoint: vpt });
            if (hovered)
              dispatch('enterShape', { shape: hovered, originalEvent, viewportPoint: vpt });
          } else {
            dispatch('enterShape', { shape: hovered, originalEvent, viewportPoint: vpt });
          }
        }

        currentHover = hovered;
      }
    });

    renderer = PIXI.autoDetectRenderer({ 
      width: offsetWidth, 
      height: offsetHeight,
      backgroundAlpha: 0,
      view: canvas
    });

    viewer.addHandler('update-viewport', refresh);

    Store.all().forEach(drawShape);
  });

  Store.observe(changes => changes.added.forEach(drawShape));

  afterUpdate(() => {
    if (selected) {
      // Restore removed objects
      removedObjects.forEach(drawShape);

      // Remove selected
      const g = renderedObjects[selected.id];
      g.destroy();

      delete renderedObjects[selected.id];

      removedObjects = [ selected ];

      refresh();
    }
  });
</script>

<style>
  :global(canvas.a9s-gl-canvas) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
