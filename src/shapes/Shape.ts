import type { Bounds } from './Bounds';

export enum ShapeType {

  POLYGON =  'POLYGON',
  
  RECTANGLE = 'RECTANGLE'

}

export interface Shape {

  id: string

  type: ShapeType,

  data?: any

  geometry: {
    
    bounds: Bounds

  }

  state: {

    isHovered?: boolean,

    isSelected?: boolean,
  
    props?: Object
      
  }

}