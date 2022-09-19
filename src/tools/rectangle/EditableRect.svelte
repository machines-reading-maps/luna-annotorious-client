<script type="ts">
  import { createEventDispatcher } from 'svelte';
  import { Store } from '@/state';
  import type { Rectangle } from '@/shapes';
  import { Handle} from '../HandleType';
  import { resize } from './transformRect';

  const dispatch = createEventDispatcher();

  export let shape: Rectangle;
  export let screenToImage: Function;

  let grabbedHandle: Handle;
  let grabbedOrigin: number[];  
  let initialShape: Rectangle;

  const onGrab = (handle: Handle) => (evt: PointerEvent) => {
    grabbedHandle = handle;    
    grabbedOrigin = screenToImage(evt.offsetX, evt.offsetY);
    initialShape = shape;

    const target = evt.target as Element;
    target.setPointerCapture(evt.pointerId);
    
    dispatch('grab');
  }

  const onPointerMove = (evt: PointerEvent) => {
    if (grabbedHandle) {
      const [x, y] = screenToImage(evt.offsetX, evt.offsetY);

      const delta = [x - grabbedOrigin[0], y - grabbedOrigin[1]];

      const updated = resize(initialShape, grabbedHandle, delta);

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
</script>

<g 
  class="a9s-annotation selected"
  class:hover={shape.state.isHovered}>

  <rect 
    on:pointerdown={onGrab(Handle.SHAPE)}
    on:pointerup={onRelease}
    on:pointermove={onPointerMove}
    x={shape.geometry.x} y={shape.geometry.y} width={shape.geometry.w} height={shape.geometry.h} />

  <rect 
    class="a9s-edge-handle a9s-edge-handle-top" 
    on:pointerdown={onGrab(Handle.TOP)}
    on:pointerup={onRelease}
    on:pointermove={onPointerMove}
    x={shape.geometry.x} y={shape.geometry.y} height={1} width={shape.geometry.w} />

  <rect 
    class="a9s-edge-handle a9s-edge-handle-right"
    on:pointerdown={onGrab(Handle.RIGHT)}
    on:pointerup={onRelease}
    on:pointermove={onPointerMove}
    x={shape.geometry.x + shape.geometry.w} y={shape.geometry.y} height={shape.geometry.h} width={1}/>

  <rect 
    class="a9s-edge-handle a9s-edge-handle-bottom" 
    on:pointerdown={onGrab(Handle.BOTTOM)}
    on:pointerup={onRelease}
    on:pointermove={onPointerMove}
    x={shape.geometry.x} y={shape.geometry.y + shape.geometry.h} height={1} width={shape.geometry.w} />

  <rect 
    class="a9s-edge-handle a9s-edge-handle-left" 
    on:pointerdown={onGrab(Handle.LEFT)}
    on:pointerup={onRelease}
    on:pointermove={onPointerMove}
    x={shape.geometry.x} y={shape.geometry.y} height={shape.geometry.h} width={1} />
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