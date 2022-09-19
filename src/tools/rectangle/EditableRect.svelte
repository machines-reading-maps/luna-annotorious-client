<script type="ts">
  import { createEventDispatcher } from 'svelte';
  import { Store } from "@/state";
  import type { Rectangle } from "@/shapes";
  
  export let shape: Rectangle;
  export let screenToImage: Function;

  const dispatch = createEventDispatcher();

  const EDGE_HANDLE_WIDTH = 6;

  let grabbed = null; // Handle or Shape

  const onGrab = handle => evt => {
    evt.target.setPointerCapture(evt.pointerId);
    grabbed = handle;

    dispatch('grab');
  }

  const onPointerMove = evt => {
    if (grabbed) {
      const { offsetX, offsetY } = evt;

      const { x, y } = screenToImage(offsetX, offsetY);

      if (grabbed === 'TOP') {
        const bottom = shape.geometry.y + shape.geometry.h;

        const updated = { 
          ...shape,
          geometry: {
            ...shape.geometry,
            y: y,
            h: bottom - y,
            bounds: {
              ...shape.geometry.bounds,
              minY: y 
            }
          }
        };

        Store.update(shape, updated);
        shape = updated;
      }
    }
  }

  const onRelease = evt => {
    evt.target.releasePointerCapture(evt.pointerId);
    grabbed = null;

    dispatch('release');
  }
</script>

<g 
  class="a9s-annotation selected"
  class:hover={shape.state.isHovered}>

  <rect x={shape.geometry.x} y={shape.geometry.y} width={shape.geometry.w} height={shape.geometry.h} />

  <rect 
    class="a9s-edge-handle a9s-edge-handle-top" 
    on:pointerdown={onGrab('TOP')}
    on:pointerup={onRelease}
    on:pointermove={onPointerMove}
    x={shape.geometry.x} y={shape.geometry.y - EDGE_HANDLE_WIDTH} width={shape.geometry.w} height={EDGE_HANDLE_WIDTH} />

  <rect 
    class="a9s-edge-handle a9s-edge-handle-right" 
    x={shape.geometry.x + shape.geometry.w} y={shape.geometry.y} width={EDGE_HANDLE_WIDTH} height={shape.geometry.h}/>

  <rect 
    class="a9s-edge-handle a9s-edge-handle-bottom" 
    x={shape.geometry.x} y={shape.geometry.y + shape.geometry.h} width={shape.geometry.w} height={EDGE_HANDLE_WIDTH}/>

  <rect 
    class="a9s-edge-handle a9s-edge-handle-left" 
    x={shape.geometry.x - EDGE_HANDLE_WIDTH} y={shape.geometry.y} width={EDGE_HANDLE_WIDTH} height={shape.geometry.h}/>
</g>

<style>
  rect {
    fill:transparent;
    vector-effect: non-scaling-stroke;
    stroke: #ff0000;
    stroke-width: 2px;
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