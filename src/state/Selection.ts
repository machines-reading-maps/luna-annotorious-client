
import { readable } from 'svelte/store';
import type { Shape } from '@/shapes';
import Store from './store/Store';

const Selection = readable<Shape[]>([], set => {

  // Shapes that are currently selected
  let currentSelection: Shape[] = [];

  Store.observe(({ updated })  => {
    const withChangedState: Shape[] = updated
        .filter(({ oldValue, newValue}) =>
          oldValue.state.isSelected !== newValue.state.isSelected)
        .map(({ newValue }) => newValue);

    // Shapes that have changed to 'selected' in this update
    const selected = withChangedState.filter(newValue => newValue.state.isSelected);

    // Ids for the shapes that have changed to 'deselected' in this update
    const deselectedIds = new Set(withChangedState.filter(newValue => 
      !newValue.state.isSelected).map(s => s.id));
  
    if (selected.length + deselectedIds.size > 0) {
        currentSelection = [
          // Remove shapes that were disabled in this update
          ...currentSelection.filter(shape => !deselectedIds.has(shape.id)),

          // Add shapes that were enabled in this update
          ...selected
        ];
    
      set(currentSelection);
    }
  });

});

export default Selection;



