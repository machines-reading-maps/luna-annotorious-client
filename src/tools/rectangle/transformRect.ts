import type { Rectangle } from '@/shapes';
import { BoundsCorner, BoundsEdge } from '../ShapeTransform';

export const resize = (
  rect: Rectangle, 
  handle: BoundsEdge | BoundsCorner,
  pointer: number[]
): Rectangle => {
  const initialBounds = rect.geometry.bounds; 

  let [x0, y0] = [initialBounds.minX, initialBounds.minY];
  let [x1, y1] = [initialBounds.maxX, initialBounds.maxY];

  const [ px, py ] = pointer;

  switch (handle) {
    case BoundsEdge.TOP:
    case BoundsCorner.TOP_LEFT:
    case BoundsCorner.TOP_RIGHT: {
      y0 = py;
      break;
    }

    case BoundsEdge.BOTTOM:
    case BoundsCorner.BOTTOM_LEFT:
    case BoundsCorner.BOTTOM_RIGHT: {
      y1 = py;
      break;
    }
  }

  switch (handle) {
    case BoundsEdge.LEFT:
    case BoundsCorner.TOP_LEFT:
    case BoundsCorner.BOTTOM_LEFT: {
      x0 = px;
      break
    }

    case BoundsEdge.RIGHT:
    case BoundsCorner.TOP_RIGHT:
    case BoundsCorner.BOTTOM_RIGHT: {
      x1 = px;
      break
    }
  }

  return {
    ...rect,
    geometry: {
      x: x0,
      y: y0,
      w: x1 - x0,
      h: y1 - y0,
      bounds: {
        minX: x0,
        minY: y0,
        maxX: x1,
        maxY: y1
      }
    }
  };
}