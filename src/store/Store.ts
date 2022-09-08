import type { Shape } from '@/shapes';
import ShapeIndex from './ShapeIndex';
import SpatialTree from './SpatialTree';
import type ChangeEvent from './ChangeEvent';

/**
 * A common facade across the spatial tree and the YJS shape index.
 * Provides access to underlying query methods and keeps data in sync.^
 */
const Store = () => {

  const tree = new SpatialTree();

  const index = new ShapeIndex();

  const observers = [];

  index.observe(evt => {
    const { keys } = evt.changes;
    
    const added = [];
    const deleted = [];
    const updated = [];

    for (const [key, value] of keys.entries()) {
      const { action, oldValue } = value;

      if (action === 'add') {
        added.push(index.get(key));
      } else if (action === 'update') {
        updated.push({ previous: oldValue, updated: index.get(key) });
      }
    }

    // Update the spatial tree
    tree.set(added, false);
    deleted.forEach(shape => tree.remove(shape));
    updated.forEach(({ previous, updated }) => tree.update(previous, updated));

    observers.forEach(observer => observer({ added, deleted, updated }));
  });

  const add = (shape: Shape) =>
    index.add(shape);

  const all = (): Shape[] =>
    index.all();

  const clear = () =>
    index.clear();

  const get = (id: string): Shape | null =>
    index.get(id);

  const getAt = (x: number, y: number): Shape | null =>
    tree.getAt(x, y);

  const observe = (callback: (evt: ChangeEvent) => void) =>
    observers.push(callback);

  const remove = (shape: Shape | string) =>
    index.remove(shape);

  const set = (shapes: Shape[]) =>
    index.set(shapes);

  const update = (previous: Shape | string, shape: Shape) => {
    const previousShape = typeof previous === 'string' ? index.get(previous) : previous; 
    index.update(previousShape, shape);
  }

  const bulkUpsert = (shapes: Shape[]) =>
    index.bulkUpsert(shapes);

  return {
    add, all, bulkUpsert, clear, get, getAt, observe, remove, set, update 
  }

}

export default Store();