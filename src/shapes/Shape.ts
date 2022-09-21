import equal from 'deep-equal';
import type { Bounds } from './Bounds';

export enum ShapeType {

  POLYGON =  'POLYGON',
  
  RECTANGLE = 'RECTANGLE'

}

export interface Shape {

  id: string

  type: ShapeType

  data?: any

  geometry: Geometry

  state: ShapeState

}

export interface Geometry {

  bounds: Bounds

}

export interface ShapeState {

  isHovered?: boolean,

  isSelected?: boolean,

  props?: Object

}

/** Object-based deep equal comparison **/
export const equals = (a: Shape, b: Shape): boolean =>
  equal(a, b);

/** Object-based deep equal comparison that ignores the shapes' states **/
export const equalsIgnoreState = (a: Shape, b: Shape): boolean => {
  // Returns the shape object without state
  const stripState = (shape: Shape) => {
    const { state, ...rest } = shape;
    return rest;
  }

  const statelessA = stripState(a);
  const statelessB = stripState(b);

  return equal(statelessA, statelessB);
}
