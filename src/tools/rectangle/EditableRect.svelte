<script type="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { Store } from '@/state';
  import type { Shape, Rectangle, RectangleGeometry } from '@/shapes';
  import { Handle} from '../HandleType';
  import { resize } from './transformRect';

  const dispatch = createEventDispatcher();

  export let shape: Shape;
  export let screenTransform: Function;
  export let shapeTransform: Function = null;
  export let reverseShapeTransform: Function = null; 

  $: geom = shapeTransform ?
    shapeTransform(shape).geometry as RectangleGeometry :
    shape.geometry as RectangleGeometry;

  let grabbedHandle: Handle;
  let grabbedOrigin: number[];  
  let initialShape: Rectangle;

  const onGrab = (handle: Handle) => (evt: PointerEvent) => {
    grabbedHandle = handle;    
    grabbedOrigin = screenTransform(evt.offsetX, evt.offsetY);
    initialShape = shapeTransform ? shapeTransform(shape as Rectangle) : shape as Rectangle;

    const target = evt.target as Element;
    target.setPointerCapture(evt.pointerId);
    
    dispatch('grab');
  }

  const onPointerMove = (evt: PointerEvent) => {
    if (grabbedHandle) {
      const [x, y] = screenTransform(evt.offsetX, evt.offsetY);

      const delta = [x - grabbedOrigin[0], y - grabbedOrigin[1]];

      let updated = resize(initialShape, grabbedHandle, delta);

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

<g 
  class="a9s-annotation selected"
  class:hover={shape.state.isHovered}>

  <rect 
    on:pointerdown={onGrab(Handle.SHAPE)}
    on:pointerup={onRelease}
    on:pointermove={onPointerMove}
    x={geom.x} y={geom.y} width={geom.w} height={geom.h} />

  <rect 
    class="a9s-edge-handle a9s-edge-handle-top" 
    on:pointerdown={onGrab(Handle.TOP)}
    on:pointerup={onRelease}
    on:pointermove={onPointerMove}
    x={geom.x} y={geom.y} height={1} width={geom.w} />

  <rect 
    class="a9s-edge-handle a9s-edge-handle-right"
    on:pointerdown={onGrab(Handle.RIGHT)}
    on:pointerup={onRelease}
    on:pointermove={onPointerMove}
    x={geom.x + geom.w} y={geom.y} height={geom.h} width={1}/>

  <rect 
    class="a9s-edge-handle a9s-edge-handle-bottom" 
    on:pointerdown={onGrab(Handle.BOTTOM)}
    on:pointerup={onRelease}
    on:pointermove={onPointerMove}
    x={geom.x} y={geom.y + geom.h} height={1} width={geom.w} />

  <rect 
    class="a9s-edge-handle a9s-edge-handle-left" 
    on:pointerdown={onGrab(Handle.LEFT)}
    on:pointerup={onRelease}
    on:pointermove={onPointerMove}
    x={geom.x} y={geom.y} height={geom.h} width={1} />
</g>

<style>
  rect {
    fill:transparent;
    vector-effect: non-scaling-stroke;
    stroke: #ff0000;
    stroke-width: 4px;
  }

  .a9s-edge-handle {
    stroke: transparent;
    stroke-width: 4px;
  }

  .a9s-edge-handle-top {
    cursor:n-resize;
  }

  .a9s-edge-handle-right {
    cursor:e-resize;
  }

  .a9s-edge-handle-bottom {
    cursor:s-resize;
  }

  .a9s-edge-handle-left {
    cursor:w-resize;
  }
</style>