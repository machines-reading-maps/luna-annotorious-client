<script lang="ts">
  import type * as PIXI from 'pixi.js';

  import { ShapeType, simplify, type Polygon, type Rectangle, type Shape } from '@/shapes';
  import BaseAnnotationLayer from '@/openseadragon/pixi/OSDPixiBaseAnnotationLayer.svelte';
  import { latLonShapeToImageRegion } from './transform';

  export let viewer: any;
  export let map: any;

  const draw = (shapes: Shape[], graphics: PIXI.Graphics) => {
    graphics.beginFill(0xff0000, 0.45);

    shapes.forEach(shape => {
      const translated = latLonShapeToImageRegion(shape, map);

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

  const toImageCoordinates = (vpt: OpenSeadragon.Point, viewer: OpenSeadragon.Viewer) => {
    const [x, y] = map.viewportToLonLat([vpt.x, vpt.y]);
    return { x, y };
  }

  const getDelta = (viewportBounds: OpenSeadragon.Rect, scale: number) => ({
    dx: - (viewportBounds.x - map.imageRegion.x) * scale,
    dy: - (viewportBounds.y - map.imageRegion.y) * scale
  });
</script>

<BaseAnnotationLayer
  viewer={viewer}
  draw={draw}
  toImageCoordinates={toImageCoordinates}
  getDelta={getDelta} 
  on:enterShape
  on:leaveShape />