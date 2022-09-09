<script lang="ts">
  import type * as PIXI from 'pixi.js';
  import { ShapeType, simplify, type Polygon, type Rectangle, type Shape } from '@/shapes';
  import BaseAnnotationLayer from './OSDPixiBaseAnnotationLayer.svelte';

  export let viewer: any;

  const draw = (shapes: Shape[], graphics: PIXI.Graphics) => {
    graphics.beginFill(0xff0000, 0.45);

    shapes.forEach(shape => {
      if (shape.type === ShapeType.RECTANGLE) {
        const { x, y, w, h } = (shape as Rectangle).geometry;
        graphics.drawRect(x, y, w, h);
      } else if (shape.type === ShapeType.POLYGON) {
        const simplified = simplify(shape as Polygon);
        const flattend = simplified.geometry.points.reduce((flat, xy) => ([...flat, ...xy]), []);   
        graphics.drawPolygon(flattend);
      }
    });

    graphics.endFill();
  }

  const toImageCoordinates = (vpt: OpenSeadragon.Point, viewer: OpenSeadragon.Viewer) =>
    viewer.viewport.viewportToImageCoordinates(vpt.x, vpt.y);

  const getDelta = (viewportBounds: OpenSeadragon.Rect, scale: number) => ({
    dx: - viewportBounds.x * scale,
    dy: - viewportBounds.y * scale
  });

</script>

<BaseAnnotationLayer
  viewer={viewer}
  draw={draw}
  toImageCoordinates={toImageCoordinates}
  getDelta={getDelta} 
  on:enterShape
  on:leaveShape />