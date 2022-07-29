import { type Bounds, boundsFromPoints, ShapeType } from '../../shapes';

interface InlineSVG {

  type: ShapeType

  geometry: {

    [key: string]: any
    
    bounds: Bounds

  }

}

export const parseSVG = (fragment: string): InlineSVG => {
  // Hack!
  const [, str] = fragment.match(/<polygon points="(.*)"/) || [];

  if (!str)
    return;
  
  const points = str.split(' ').map(p => p.split(',').map(parseFloat));

  return { 
    type: ShapeType.POLYGON,
    geometry: { 
      points,
      bounds: boundsFromPoints(points)
    }
  }

}