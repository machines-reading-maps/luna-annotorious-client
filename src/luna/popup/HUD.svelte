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

  const anim = (from: number, to: number, angle: number, spring: Function, conf: object) => (node: Element, config: object) => {
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
</style>