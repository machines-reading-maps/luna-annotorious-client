<script type="ts">
  import type { Shape } from '@/core/shapes';
  import { ToolHandle, Tool } from '@/tools';
  import { editRectangle } from './editRectangle';

  export let shape: Shape;
  export let screenTransform: Function;
  export let shapeTransform: Function = null;
  export let reverseShapeTransform: Function = null;
  export let viewportScale: number = null;

  $: handleSize = 10 / viewportScale;
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
    on:pointerup={release}
    on:pointermove={pointerMove}>

    <line x1={geometry.x + handleSize / 2} y1={geometry.y} x2={geometry.x + geometry.w - handleSize / 2} y2={geometry.y} />
    <line x1={geometry.x + geometry.w} y1={geometry.y + handleSize / 2} x2={geometry.x + geometry.w} y2={geometry.y + geometry.h - handleSize / 2} />
    <line x1={geometry.x + handleSize / 2} y1={geometry.y + geometry.h} x2={geometry.x + geometry.w - handleSize / 2} y2={geometry.y + geometry.h} />
    <line x1={geometry.x} y1={geometry.y + handleSize / 2} x2={geometry.x} y2={geometry.y + geometry.h - handleSize / 2} />

    <rect 
      class="a9s-shape-handle"
      on:pointerdown={grab(ToolHandle.SHAPE)}
      x={geometry.x + (geometry.w - handleSize) / 2} y={geometry.y + (geometry.h - handleSize) / 2} width={handleSize} height={handleSize} />

    <rect 
      class="a9s-edge-handle a9s-edge-handle-top" 
      on:pointerdown={grab(ToolHandle.TOP)}
      x={geometry.x} y={geometry.y} height={1} width={geometry.w} />

    <rect 
      class="a9s-edge-handle a9s-edge-handle-right"
      on:pointerdown={grab(ToolHandle.RIGHT)}
      x={geometry.x + geometry.w} y={geometry.y} height={geometry.h} width={1}/>

    <rect 
      class="a9s-edge-handle a9s-edge-handle-bottom" 
      on:pointerdown={grab(ToolHandle.BOTTOM)}
      x={geometry.x} y={geometry.y + geometry.h} height={1} width={geometry.w} />

    <rect 
      class="a9s-edge-handle a9s-edge-handle-left" 
      on:pointerdown={grab(ToolHandle.LEFT)}
      x={geometry.x} y={geometry.y} height={geometry.h} width={1} />

    <rect 
      class="a9s-corner-handle a9s-corner-handle-topleft"
      on:pointerdown={grab(ToolHandle.TOP_LEFT)}
      x={geometry.x - handleSize / 2} y={geometry.y - handleSize / 2} height={handleSize} width={handleSize} />

    <rect 
      class="a9s-corner-handle a9s-corner-handle-topright"
      on:pointerdown={grab(ToolHandle.TOP_RIGHT)}
      x={geometry.x + geometry.w - handleSize / 2} y={geometry.y - handleSize / 2} height={handleSize} width={handleSize} />
    
    <rect 
      class="a9s-corner-handle a9s-corner-handle-bottomright"
      on:pointerdown={grab(ToolHandle.BOTTOM_RIGHT)}
      x={geometry.x + geometry.w - handleSize / 2} y={geometry.y + geometry.h - handleSize / 2} height={handleSize} width={handleSize} />
      
    <rect 
      class="a9s-corner-handle a9s-corner-handle-bottomleft"
      on:pointerdown={grab(ToolHandle.BOTTOM_LEFT)}
      x={geometry.x - handleSize / 2} y={geometry.y + geometry.h - handleSize / 2} height={handleSize} width={handleSize} />
  </g>
</Tool>

<style>
  rect {
    fill: rgba(255, 255, 255, 0.4);
    vector-effect: non-scaling-stroke;
    stroke: #06acee;
    stroke-width: 2px;
  }

  line {
    vector-effect: non-scaling-stroke;
    stroke: #06acee;
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
