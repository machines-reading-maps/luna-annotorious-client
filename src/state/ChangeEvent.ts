import type { Shape } from '@/shapes';

interface ChangeEvent {

  added?: Shape[]

  deleted?: Shape[]

  updated?: [{

    oldValue: Shape,
  
    newValue: Shape
  
  }]

}

export default ChangeEvent;