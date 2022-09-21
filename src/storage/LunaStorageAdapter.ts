import { ShapeType, type Rectangle, type Shape } from '@/shapes';
import { type Selector, parseW3C } from '@/formats/w3c';
import { API_BASE } from '@/Config';

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

const toW3C = (shape: Shape, source: string): Object => ({
  '@context': 'http://www.w3.org/ns/anno.jsonld',
  type: 'Annotation',
  id: shape.id,
  body: shape.data?.body || [],
  target: {
    source,
    selector: shape.type === ShapeType.RECTANGLE ? toFragmentSelector(shape as Rectangle) : toSvgSelector(shape)
  }
})

const LunaStorageAdapter = ({ store, source }) => {
  // How to handle this? Load only my own corrections? Merge/replace with Luna annotations?
  fetch(`${API_BASE}/annotation/search?source=${source}`).then(res => res.json()).then(data => {
    if (data.length > 0) {
      console.log(`Got ${data.length} corrections`);
      console.log(data);

      const { parsed } = parseW3C(data);
      store.bulkUpsert(parsed);
    }
  }).then(() => {
    // Observe changes after the initial load
    store.observe(changes => {
      // Currently, the UI will only make updates, anyway
      const { updated }  = changes;

      updated.forEach(({ oldValue, newValue }) => {
        console.log('Storing', newValue);
        
        const w3c = toW3C(newValue, source);

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
      });
    }, true); // Ignore state changes
  });

}

export default LunaStorageAdapter;