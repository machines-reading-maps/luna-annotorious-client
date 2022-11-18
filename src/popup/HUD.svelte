<script type="ts">
  import { createEventDispatcher } from 'svelte';
  import { springIn, springOut } from 'svelte-helpers/spring-transitions';
  
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import RiDesignShapeFill from 'svelte-icons-pack/ri/RiDesignShapeFill';
  import RiEditorText from 'svelte-icons-pack/ri/RiEditorText';
  import BiBuildingHouse from 'svelte-icons-pack/bi/BiBuildingHouse';

  const SPRING_IN = { stiffness: 0.2, damping: 0.3 };
  const SPRING_OUT = { stiffness: 0.3, damping: 0.8 };

  const dispatch = createEventDispatcher();

  const anim = (from: number, to: number, angle: number, spring: Function, conf: object) => (node: Element) => {
    const { duration, tickToValue } = spring(from, to, conf);

    return {
      duration: duration,
      css: (t: number) => { 
        const dx = - tickToValue(t) * Math.sin(angle);
        const dy = tickToValue(t) * Math.cos(angle);
        return `transform: translate(${dx}px, ${dy}px)`;
      }
    }
  }

  const inShape = anim(82, 0, 0, springIn, SPRING_IN);
  const inTranscription = anim(82, 0, Math.PI / 4, springIn, SPRING_IN);
  const inType = anim(82, 0, Math.PI / 2, springIn, SPRING_IN);

  const outShape = anim(0, 82, 0, springOut, SPRING_OUT);
  const outTranscription = anim(0, 82, Math.PI / 4, springOut, SPRING_OUT);
  const outType = anim(0, 82, Math.PI / 2, springOut, SPRING_OUT);
</script>

<div class="r8s-hover-hud">
  <ul>
    <li>
      <button 
        class="action-button" 
        id="action-edit-shape" 
        data-tooltip="Edit Shape"
        on:click={() => dispatch('editShape')}
        in:inShape 
        out:outShape>
        <Icon src={RiDesignShapeFill} />
      </button>
    </li>

    <li>
      <button 
        class="action-button" 
        id="action-fix-transcription" 
        data-tooltip="Fix Transcription"
        on:click={() => dispatch('fixTranscription')}
        in:inTranscription 
        out:outTranscription>
        <Icon src={RiEditorText} />
      </button>
    </li>

    <li>
      <button 
        class="action-button" 
        id="action-change-type"
        data-tooltip="Change Feature Type" 
        on:click={() => dispatch('changeType')}
        in:inType 
        out:outType>
        <Icon src={BiBuildingHouse} />
      </button>
    </li>
  </ul>
  <div class="mousetrap" />
</div>

<style>
  .r8s-hover-hud {
    z-index: 0;
  }

  ul {
    list-style-type: none;
  }

  ul, li {
    margin: 0;
    padding: 0;
  }

  button {
    outline: none;
    border: none;
    border-radius: 50%;
    background-color: #4285f4;
    width: 52px;
    height: 52px;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #fff;
    box-shadow:0 0 12px rgba(0, 0, 0, 0.25);
    position: absolute;
    cursor: pointer;
  }

  :global(.r8s-hover-hud button svg) {
    fill: #fff;
  }

  button:hover {
    background-color: #68a1ff;
  }

  #action-edit-shape {
    top: -70px;
    right: 24px;
  }

  #action-fix-transcription {
    top: -52px;
    right: -50px;
  }

  #action-change-type {
    top: 12px;
    right: -65px; 
  }

  .mousetrap {
    position: absolute;
    top: -80px;
    right: -75px;
    width: 170px;
    height: 160px;
    z-index: -1;
  }

  /* https://svelte.dev/repl/3153faf7584d40bd8ddebecf39f24ac1?version=3.49.0 */
  :global([data-tooltip]) {
    position: relative;
    z-index: 9999;
    display: block;
  }

  :global([data-tooltip]:before),
  :global([data-tooltip]:after) {
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
    transition: .2s ease-out;
    transform: translate(-50%, 5px)
  }

  :global([data-tooltip]:before) {
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-bottom: 5px;
    padding: 7px;
    min-width: 60px;
    max-width: 250px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    background-color: #000;
    background-color: hsla(0, 0%, 20%, 0.9);
    color: #fff;
    content: attr(data-tooltip);
    text-align: center;
    font-size: 14px;
    line-height: 1.2;
    transition: .2s ease-out
  }

  :global([data-tooltip]:after) {
    position: absolute;
    bottom: 100%;
    left: 50%;
    width: 0;
    border-top: 5px solid #000;
    border-top: 5px solid hsla(0, 0%, 20%, 0.9);
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    content: " ";
    font-size: 0;
    line-height: 0;
  }

  :global([data-tooltip]:hover:before),
  :global([data-tooltip]:hover:after) {
    visibility: visible;
    opacity: 1;
    transform: translate(-50%, 0)
  }

  :global([data-tooltip=false]:hover:before),
  :global([data-tooltip=false]:hover:after) {
    visibility: hidden;
    opacity: 0;
  }
</style>