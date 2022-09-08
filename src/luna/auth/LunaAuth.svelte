<script type="ts">
  import { onMount } from 'svelte';

  export let loginUrl: string;
  export let tokenUrl: string;
  
  // Login state
  let state = 'CHECKING';

  // Auth iframe reference
  let iframe: HTMLIFrameElement;

  onMount(() => {
    const onFetchToken = () => {
      console.log('fetch token');

      if (iframe.contentDocument) {
        state = 'LOGGED_IN';
      } else { 
        state = 'LOGGED_OUT';
      }
    }

    iframe.addEventListener('load', onFetchToken);
    iframe.addEventListener('error', onFetchToken);

    const onMessage = (evt: MessageEvent) => {
      console.log('message event:', evt);
    };

    window.addEventListener('message', onMessage);
    
    return () => window.removeEventListener('message', onMessage);
  });

  const doLogin = () => {
    const popup = window.open(loginUrl, "_blank", "height=377,width=606");

    const interval = setInterval(() => {
      console.log(popup.document.domain);
    }, 500);
  }
</script>

<div class="luna-auth-widget">
  {#if state === 'CHECKING'}
    Checking...
    <iframe 
      bind:this={iframe}
      title="iiif-auth-iframe"
      src={tokenUrl} />
  {:else if state === 'LOGGED_OUT'}
    Not logged in <button on:click={doLogin}>Login</button>
  {:else if state === 'LOGGED_IN'}
    Logged in!
  {/if}


</div>

<style>
  .luna-auth-widget {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: #fff;
    padding: 10px 14px;
    border-radius: 3px;
    box-shadow: 1px 1px 12px rgba(0,0,0,0.2);
  }

  .luna-auth-widget iframe {
    display: none;
  }
</style>