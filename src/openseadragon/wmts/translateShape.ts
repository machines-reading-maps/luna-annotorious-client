import { ShapeType, boundsFromPoints } from '../../shapes';

import type { Shape, Polygon, Rectangle } from '../../shapes';

const translatePolygon = (polygon: Polygon, map: any): Polygon => {
  const points: Array<Array<number>> = polygon.geometry.points.map(map.lonLatToImageRegion);

  return {
    ...polygon,
    geometry: {
      points,
      bounds: boundsFromPoints(points)
    },
  }
}

const translateRectangle = (rectangle: Rectangle, map: any): Rectangle => {
  const {x, y, w, h} = rectangle.geometry;

  const [x0, y0] = map.lonLatToImageRegion([x, y]);
  const [x1, y1] = map.lonLatToImageRegion([x + w, y - h]);

  return {
    ...rectangle,
    geometry: {
      x: x0,
      y: y1,
      w: x1 - x0,
      h: y1 - y0,
      bounds: {
        minX: x0,
        minY: y0,
        maxX: x1,
        maxY: y1
      }
    }
  }
}

export const translateShape = (shape: Shape, map: any): Shape => {
  if (shape.type === ShapeType.POLYGON)
    return translatePolygon(shape as Polygon, map);
  else if (shape.type === ShapeType.RECTANGLE)
    return translateRectangle(shape as Rectangle, map);
}