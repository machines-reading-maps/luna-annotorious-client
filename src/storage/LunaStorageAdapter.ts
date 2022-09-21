import { API_BASE } from '@/Config';
import { ShapeType, equalsIgnoreState }  from '@/shapes';
import type { Rectangle, Shape } from '@/shapes';
import type { Store } from '@/state';
import { type Selector, parseW3C } from '@/formats/w3c';

const toFragmentSelector = (rect: Rectangle): Selector => {
  const { x, y, w, h } = rect.geometry;

  return {
    type: 'FragmentSelector',
    conformsTo: 'http://www.w3.org/TR/media-frags/',
    value: `xywh=pixel:${x},${y},${w},${h}`
  }
}

// TODO implement
const toSvgSelector = (shape: Shape): Selector => {
  return null;
}

const toW3CAnnotation = (shape: Shape, source: string): Object => ({
  '@context': 'http://www.w3.org/ns/anno.jsonld',
  type: 'Annotation',
  id: shape.id,
  body: shape.data?.body || [],
  target: {
    source,
    selector: shape.type === ShapeType.RECTANGLE ? toFragmentSelector(shape as Rectangle) : toSvgSelector(shape)
  }
});

const LunaStorageAdapter = ({ store, source }: { store: typeof Store, source: string }) => {

  // We'll listen to deselect events for storage, but
  // don't want to store annotations that were not changed.
  // Therefore we keep a reference to the last selection, and
  // compare for changes on deselect.
  let lastSelection: Shape = null;

  // How to handle this? Load only my own corrections? Merge/replace with Luna annotations?
  fetch(`${API_BASE}/annotation/search?source=${source}`).then(res => res.json()).then(data => {
    if (data.length > 0) {
      const { parsed } = parseW3C(data);

      store.bulkUpsert(parsed);
    }
  }).then(() => {
    const observeOptions = {
      ignoreHoverStateChanges: true
    };
    
    store.observe(changes => {
      // TODO listen for delete, once the UI supports it
      const { updated }  = changes;

      updated.forEach(({ newValue }) => {
        if (newValue.state.isSelected) {
          lastSelection = newValue;

        } else if (lastSelection && equalsIgnoreState(lastSelection, newValue)) {          
          const w3c = toW3CAnnotation(newValue, source);

          fetch(`${API_BASE}/annotation`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(w3c)
          }).then(res => res.json()).then(data => {
            console.log('API reply:', data);

          }).catch(error => {
            // TODO raise event?
            console.error('ERROR storing annotation', error);

          });
        }
      });
    }, observeOptions);
  });

}

export default LunaStorageAdapter;