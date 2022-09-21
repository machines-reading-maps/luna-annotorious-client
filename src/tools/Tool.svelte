<script type="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { Store } from '@/core/state';
  import type { Shape, Rectangle } from '@/core/shapes';
  import type { ToolHandle } from '@/tools';

  const dispatch = createEventDispatcher();

  export let shape: Shape;

  export let screenTransform: Function;
  
  export let shapeTransform: Function = null;
  
  export let reverseShapeTransform: Function = null; 

  export let onDrag: (s: Shape, h: ToolHandle, delta: number[]) => Shape;

  $: geometry = shapeTransform ?
    shapeTransform(shape).geometry : shape.geometry;

  let initialShape: Shape;

  let grabbedHandle: ToolHandle;

  let grabbedShape: Shape;
  
  let grabbedOrigin: number[];  

  const onGrab = (handle: ToolHandle) => (evt: PointerEvent) => {
    grabbedHandle = handle;    
    grabbedShape = shapeTransform ? shapeTransform(shape as Rectangle) : shape as Rectangle;
    grabbedOrigin = screenTransform(evt.offsetX, evt.offsetY);

    const target = evt.target as Element;
    target.setPointerCapture(evt.pointerId);
    
    dispatch('grab');
  }

  const onPointerMove = (evt: PointerEvent) => {
    if (grabbedHandle) {
      const [x, y] = screenTransform(evt.offsetX, evt.offsetY);

      const delta = [x - grabbedOrigin[0], y - grabbedOrigin[1]];

      let updated = onDrag(grabbedShape, grabbedHandle, delta);

      if (reverseShapeTransform)
        updated = reverseShapeTransform(updated);

      Store.update(shape, updated);

      shape = updated;
    }
  }

  const onRelease = (evt: PointerEvent) => {
    const target = evt.target as Element;    
    target.releasePointerCapture(evt.pointerId);

    grabbedHandle = null;

    dispatch('release');
  }

  onMount(() => {
    initialShape = shapeTransform ? shapeTransform(shape as Rectangle) : shape as Rectangle;

    const onKeyDown = (evt: KeyboardEvent) => {
      if (evt.code === 'Enter')
        dispatch('save', shape)
      else if (evt.code === 'Escape')
        dispatch('cancel', initialShape);
    };
    
    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  });
</script>

<slot 
  geometry={geometry} 
  grab={onGrab}
  pointerMove={onPointerMove}
  release={onRelease} />