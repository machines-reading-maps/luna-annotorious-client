<script lang="ts">
  import * as PIXI from 'pixi.js';
  import type OpenSeadragon from 'openseadragon';
  import { ShapeType, simplify, type Polygon, type Rectangle, type Shape } from '@/core/shapes';
  import BaseAnnotationLayer from './OSDPixiBaseAnnotationLayer.svelte';

  export let viewer: OpenSeadragon.Viewer;

  const drawShape = (shape: Shape) => {
    if (shape.type === ShapeType.RECTANGLE) {
      const { x, y, w, h } = (shape as Rectangle).geometry;

      const rect = new PIXI.Graphics();
      rect.beginFill(0xff0000, 0.45);
      rect.drawRect(x, y, w, h);
      rect.endFill();

      return rect;
    } else if (shape.type === ShapeType.POLYGON) {
      const simplified = simplify(shape as Polygon);
      const flattend = simplified.geometry.points.reduce((flat, xy) => ([...flat, ...xy]), []);   

      const poly = new PIXI.Graphics();
      poly.beginFill(0xff0000, 0.45);
      poly.drawPolygon(flattend);
      poly.endFill();

      return poly;
    }
  }

  const viewportToLayerPoint = (vpt: OpenSeadragon.Point, viewer: OpenSeadragon.Viewer) =>
    viewer.viewport.viewportToImageCoordinates(vpt.x, vpt.y);

  const viewportToLayerDelta = (viewportBounds: OpenSeadragon.Rect, scale: number) => ({
    dx: - viewportBounds.x * scale,
    dy: - viewportBounds.y * scale
  });
</script>

<BaseAnnotationLayer
  viewer={viewer}
  config={{
    drawShape, 
    viewportToLayerPoint,
    viewportToLayerDelta
  }} />