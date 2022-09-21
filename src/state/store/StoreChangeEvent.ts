import equal from 'deep-equal';
import type { Shape } from '@/shapes';

export interface StoreChangeEvent {

  added?: Shape[]

  deleted?: Shape[]

  updated?: {

    oldValue: Shape,
  
    newValue: Shape
  
  }[]

}

export const removeStateChanges = (event: StoreChangeEvent, propsToRemove: string[] = []): StoreChangeEvent=> {
  const { added, deleted, updated } = event;

  // Returns the shape object, without state
  const stripState = (shape: Shape) => {
    const { state, ...rest } = shape;

    if (propsToRemove.length === 0) {
      // Remove all state
      return rest;
    } else {
      // Remove specific state props only
      propsToRemove.forEach(prop => {
        delete state[prop];
      });
      
      return { ...rest, state };
    }
  }

  const updatesWithoutStateChanges = updated.filter(({ oldValue, newValue}) => {
    const a = stripState(oldValue);
    const b = stripState(newValue);
    return !equal(a, b);
  });

  return { added, deleted, updated: updatesWithoutStateChanges };
}

export const isEmptyEvent = (event: StoreChangeEvent): boolean => 
  event.added.length + event.deleted.length + event.updated.length === 0;

