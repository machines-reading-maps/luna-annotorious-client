<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import * as PIXI from 'pixi.js';
  import OpenSeadragon from 'openseadragon';

  import { Store } from '@/store';
  import { type Shape, ShapeType, simplify, type Rectangle, type Polygon } from '@/shapes';
  import { redraw, translateShape } from './wmts';
  
  export let viewer: any;
  export let map = null;

  let currentHover: Shape | null;

  const graphics = new PIXI.Graphics();

  const dispatch = createEventDispatcher();

  const draw = (shapes: Shape[]) => {
    graphics.beginFill(0xff0000, 0.45);

    shapes.forEach(shape => {
      const translated = translateShape(shape, map);

      if (translated.type === ShapeType.RECTANGLE) {
        const { x, y, w, h } = (translated as Rectangle).geometry;
        graphics.drawRect(x, y, w, - h);
      } else if (translated.type === ShapeType.POLYGON) {
        const simplified = simplify(translated as Polygon);
        const flattend = simplified.geometry.points.reduce((flat, xy) => ([...flat, ...xy]), []);   
        graphics.drawPolygon(flattend);
      }
    });

    graphics.endFill();
  }

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
        const [lon, lat] = map.viewportToLonLat([vpt.x, vpt.y]);

        const hovered = Store.getAt(lon, lat);

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

    const renderer = PIXI.autoDetectRenderer({ 
      width: offsetWidth, 
      height: offsetHeight,
      backgroundAlpha: 0,
      view: canvas
    });

    viewer.addHandler('update-viewport', redraw(viewer, renderer, graphics, map));

    draw(Store.all());
  });

  Store.observe(changes => {
    draw(changes.added);
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
