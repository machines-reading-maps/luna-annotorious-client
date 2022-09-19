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