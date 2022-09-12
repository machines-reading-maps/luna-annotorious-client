<script type="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { API_BASE } from '@/Config';

  export let tokenUrl: string;
  export let loginUrl: string;
  export let logoutUrl: string;

  const dispatch = createEventDispatcher();
  
  // Login state
  let state = 'QUERY_TOKEN_SERVICE';
  let user = null;

  // Auth iframe reference
  let iframe: HTMLIFrameElement;

  onMount(() => {
    const afterIFrameOpened = () => {
      if (iframe.contentDocument) {
        // iframe loaded content - now wait if we receive a token message
        state = 'WAITING_FOR_TOKEN';
      } else { 
        // iframe content was blocked - we're definitely logged out
        state = 'LOGGED_OUT';
      }
    }

    iframe.addEventListener('load', afterIFrameOpened);
    iframe.addEventListener('error', afterIFrameOpened);

    const onMessage = (evt: MessageEvent) => {
      try {
        const { accessToken } = JSON.parse(evt.data);

        // 'Log in' on the server with the token. The server will verify the 
        // token, set an HttpOnly cookie (not accessible to JS), and respond
        // with user details. If the token is not valid, the server will respond
        // with HTTP 401 Unauthorized instead.
        fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ accessToken })
        }).then(res => res.json()).then(data => {
          user = data.user;
          state = 'LOGGED_IN';

          dispatch('authenticated', user);
        });
      } catch (error) {
        console.error('Failed to retrieve token', evt);
      }
    };

    window.addEventListener('message', onMessage);
    
    return () => window.removeEventListener('message', onMessage);
  });

  const doLogin = () => {

    const popup = window.open(loginUrl, "_blank", "height=377,width=606");

    /*
    const interval = setInterval(() => {
      console.log(popup.document.domain);
    }, 500);
    */
  }
</script>

<div class="luna-auth-widget">
  {#if state === 'QUERY_TOKEN_SERVICE' || state === 'WAITING_FOR_TOKEN'}
    {state}
    <iframe 
      bind:this={iframe}
      title="iiif-auth-iframe"
      src={tokenUrl} />
  {:else if state === 'LOGGED_OUT'}
    Not logged in <a href={loginUrl}>Login</a>
  {:else if state === 'LOGGED_IN'}
    Logged in as: {user} <a href={logoutUrl}>Logout</a>
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