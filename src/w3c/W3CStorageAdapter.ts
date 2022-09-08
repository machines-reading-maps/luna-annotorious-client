import { ShapeType, type Rectangle, type Shape } from '@/shapes';
import type { Selector, WebAnnotation } from '.';

// TODO make configurable
const API_BASE = '/api';

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

const toW3C = (shape: Shape, source: string): WebAnnotation => ({
  id: shape.id,
  body: shape.data?.body || [],
  target: [{
    source,
    selector: shape.type === ShapeType.RECTANGLE ? toFragmentSelector(shape as Rectangle) : toSvgSelector(shape)
  }]
})

const StorageAdapter = ({ store, source }) => {

  store.observe(changes => {

    // console.log('adapter. changes', changes);
  
    // Currently, the UI will only make updates, anyway
    const { updated }  = changes;

    updated.forEach(({ previous, updated } : { previous: Shape, updated: Shape}) => {
      const w3c = toW3C(updated, source);

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
  });

}

export default StorageAdapter;