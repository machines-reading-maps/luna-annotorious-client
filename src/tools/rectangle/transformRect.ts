import type { Rectangle } from '@/core/shapes';
import { Handle } from '../HandleType';

export const resize = (
  rect: Rectangle, 
  handle: Handle,
  delta: number[]
): Rectangle => {
  const initialBounds = rect.geometry.bounds; 

  let [x0, y0] = [initialBounds.minX, initialBounds.minY];
  let [x1, y1] = [initialBounds.maxX, initialBounds.maxY];

  const [ dx, dy ] = delta;

  if (handle === Handle.SHAPE) {
    x0 += dx;
    x1 += dx;
    y0 += dy;
    y1 += dy;
  } else {
    switch (handle) {
      case Handle.TOP:
      case Handle.TOP_LEFT:
      case Handle.TOP_RIGHT: {
        y0 += dy;
        break;
      }

      case Handle.BOTTOM:
      case Handle.BOTTOM_LEFT:
      case Handle.BOTTOM_RIGHT: {
        y1 += dy;
        break;
      }
    }

    switch (handle) {
      case Handle.LEFT:
      case Handle.TOP_LEFT:
      case Handle.BOTTOM_LEFT: {
        x0 += dx;
        break
      }

      case Handle.RIGHT:
      case Handle.TOP_RIGHT:
      case Handle.BOTTOM_RIGHT: {
        x1 += dx;
        break
      }
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