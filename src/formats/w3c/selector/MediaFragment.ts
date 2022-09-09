import type { Bounds } from '@/shapes';

export interface MediaFragment {

  x: number

  y: number
  
  w: number

  h: number
  
  bounds: Bounds

}

export const parseMediaFragment = (fragment: string, invertY = false): MediaFragment => {
  // Note that RegExp parsing is significantly faster than this!
  // TODO re-implent this using RegEx
  const [prefix, value] = fragment.split('=');

  if (prefix !== 'xywh')
    throw new Error('Unsupported MediaFragment: ' + fragment);

  const unit = value.includes(':') ?
    value.substring(0, value.indexOf(':')) : 'pixel';

  const coords = value.includes(':') ?
    value.substring(value.indexOf(':') + 1).split(',') : value.split(',');
    
  if (unit === 'percent')
    throw new Error('Unsupported MediaFragment unit: percent');
  else if (unit !== 'pixel')
    throw new Error('Unsupported MediaFragment unit: percent');

  const [x, y, w, h] = coords.map(parseFloat);

  return {
    x, y, w, h,
    bounds: {
      minX: x,
      minY: invertY ? y - h : y,
      maxX: x + w,
      maxY: invertY ? y : y + h
    }
  }

}