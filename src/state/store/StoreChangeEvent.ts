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

export const removeStateUpdates = (event: StoreChangeEvent): StoreChangeEvent=> {
  const { added, deleted, updated } = event;

  // Returns the shape object, without state
  const stripState = (shape: Shape) => {
    const { state, ...rest } = shape;
    return rest;
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

