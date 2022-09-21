<script type="ts">
  import type { Shape } from '@/core/shapes';
  import { ToolHandle, Tool } from '@/tools';
  import { editRectangle } from './editRectangle';

  export let shape: Shape;
  export let screenTransform: Function;
  export let shapeTransform: Function = null;
  export let reverseShapeTransform: Function = null;
</script>

<Tool
  shape={shape}
  screenTransform={screenTransform}
  shapeTransform={shapeTransform}
  reverseShapeTransform={reverseShapeTransform} 
  dragHandler={editRectangle}

  on:grab
  on:release
  on:save
  on:cancel

  let:geometry={geometry}
  let:grab={grab}
  let:pointerMove={pointerMove}
  let:release={release}>

  <g
    class="a9s-annotation selected"
    class:hover={shape.state.isHovered}>

    <rect 
      on:pointerdown={grab(ToolHandle.SHAPE)}
      on:pointerup={release}
      on:pointermove={pointerMove}
      x={geometry.x} y={geometry.y} width={geometry.w} height={geometry.h} />

    <rect 
      class="a9s-edge-handle a9s-edge-handle-top" 
      on:pointerdown={grab(ToolHandle.TOP)}
      on:pointerup={release}
      on:pointermove={pointerMove}
      x={geometry.x} y={geometry.y} height={1} width={geometry.w} />

    <rect 
      class="a9s-edge-handle a9s-edge-handle-right"
      on:pointerdown={grab(ToolHandle.RIGHT)}
      on:pointerup={release}
      on:pointermove={pointerMove}
      x={geometry.x + geometry.w} y={geometry.y} height={geometry.h} width={1}/>

    <rect 
      class="a9s-edge-handle a9s-edge-handle-bottom" 
      on:pointerdown={grab(ToolHandle.BOTTOM)}
      on:pointerup={release}
      on:pointermove={pointerMove}
      x={geometry.x} y={geometry.y + geometry.h} height={1} width={geometry.w} />

    <rect 
      class="a9s-edge-handle a9s-edge-handle-left" 
      on:pointerdown={grab(ToolHandle.LEFT)}
      on:pointerup={release}
      on:pointermove={pointerMove}
      x={geometry.x} y={geometry.y} height={geometry.h} width={1} />
  </g>
</Tool>

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
