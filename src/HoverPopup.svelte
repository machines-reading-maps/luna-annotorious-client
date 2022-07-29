<script>
  import { onMount, afterUpdate } from 'svelte';

  export let viewer; 

  export let offsetX;
  export let offsetY;
  
  export let viewportPoint;

  export let shape;

  let lastTouch = new Date().getTime();

  let hover = null;

  $: transcription = shape?.data.find(body => body.purpose === 'transcribing')?.value;

  afterUpdate(() => {
    if (shape) {
      // Enter shape
      if (!hover) {
        hover = {
          offsetX,
          offsetY, 
          shape,
          viewportPoint,
          transcription
        };
      } else {
        setTimeout(() => {
          const current = new Date().getTime();
          if (current - lastTouch > 100) {
            const x = (hover && hover.shape === shape) ? hover.x : offsetX; 
            const y = (hover && hover.shape === shape) ? hover.y : offsetY; 

            if (x && y)
              hover = {
                offsetX: x, 
                offsetY: y,
                shape,
                viewportPoint,
                transcription
              };
          }
        }, 100);
      }
    } else {
      // Leave shape
      setTimeout(() => {
        const currentTime = new Date().getTime();

        if (currentTime - lastTouch > 400)
          hover = null;
      }, 100);
    }
  });

  onMount(() => {
    const onUpdateViewport = () => {
      if (hover) {
        const { x, y } = viewer.viewport.viewportToViewerElementCoordinates(hover.viewportPoint);
        hover = {...hover, offsetX: x, offsetY: y }
      }
    }

    const onPinch = () =>
      lastTouch = new Date().getTime();

    viewer.addHandler('update-viewport', onUpdateViewport);
    viewer.addHandler('canvas-pinch', onPinch);
  })
</script>

{#if hover}
  <div class="hover" style={`top: ${hover.offsetY}px; left: ${hover.offsetX}px`}>
    {hover.transcription}
  </div>
{/if}

<style>
  .hover {
    font-family: Arial, Helvetica, sans-serif;
    color: #333;
    position: absolute;
    padding: 14px;
    border-radius: 3px;
    background-color: #fff;
    border: 1px solid #cbccce;
    box-shadow:0 0 24px rgba(0, 0, 0, 0.1);
    z-index: 9999;
  }
</style>