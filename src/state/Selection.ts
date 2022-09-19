import type { Shape } from '@/shapes';
import { readable } from 'svelte/store';
import { Store } from '.';

export const Selection = readable<Shape[]>([], set => {

  let currentSelection: Shape[] = [];

  Store.observe(({ updated }) => {
    const withChangedSelectionStates =
      updated
        .filter(({ oldValue, newValue}) =>
          oldValue.state.isSelected !== newValue.state.isSelected)
        .map(({ newValue }) => newValue);

    const selected = withChangedSelectionStates.filter(newValue => 
      newValue.state.isSelected);

    const deselectedIds = new Set(withChangedSelectionStates.filter(newValue => 
      !newValue.state.isSelected).map(s => s.id));
  
    if (selected.length + deselectedIds.size > 0) {
        currentSelection = [
          ...currentSelection.filter(shape => !deselectedIds.has(shape.id)),
          ...selected
        ];
    
      set(currentSelection);
    }
  });

});