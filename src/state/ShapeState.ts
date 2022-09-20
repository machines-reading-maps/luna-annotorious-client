
import { readable } from 'svelte/store';
import type { Shape } from '@/shapes';
import Store from './store/Store';

export const ShapeState = (property: string) => readable<Shape[]>([], set => {

  // Shapes that currently have 'property' enabled
  let currentEnabled: Shape[] = [];

  Store.observe(({ updated })  => {
    const withChangedState: Shape[] = updated
        .filter(({ oldValue, newValue}) =>
          oldValue.state[property] !== newValue.state[property])
        .map(({ newValue }) => newValue);

    // Shapes that have changed to 'enabled' for this state in this update
    const enabled = withChangedState.filter(newValue => newValue.state[property]);

    // Ids for the shapes that have changed to 'disabled' in this updated
    const disabledIds = new Set(withChangedState.filter(newValue => 
      !newValue.state[property]).map(s => s.id));
  
    if (enabled.length + disabledIds.size > 0) {
        currentEnabled = [
          // Remove shapes that were disabled in this update
          ...currentEnabled.filter(shape => !disabledIds.has(shape.id)),

          // Add shapes that were enabled in this update
          ...enabled
        ];
    
      set(currentEnabled);
    }
  });

});




