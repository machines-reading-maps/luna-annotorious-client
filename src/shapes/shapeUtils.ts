import equal from 'deep-equal';
import type { Shape, ShapeType } from './Shape';

export interface ShapeUtil<T extends Shape> {

  area: (shape: T) => number
  
  intersects: (shape: T, x: number, y: number) => boolean

}

const Utils: { [key: string]: ShapeUtil<any> } = {};

export const registerShapeUtil = (key: ShapeType, util: ShapeUtil<any>) =>
  Utils[key] = util;

export const computeArea = (shape: Shape) =>
  Utils[shape.type].area(shape);

export const intersects = (shape: Shape, x: number, y: number) =>
  Utils[shape.type].intersects(shape, x, y);

export const equals = (a: Shape, b: Shape): boolean =>
  equal(a, b);

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

