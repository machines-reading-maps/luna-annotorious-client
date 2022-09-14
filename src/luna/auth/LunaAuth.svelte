<script type="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { BarLoader } from 'svelte-loading-spinners';
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import FiLogIn from 'svelte-icons-pack/fi/FiLogIn';
  import FiLogOut from 'svelte-icons-pack/fi/FiLogOut';
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
          if (data.user) {
            user = data.user;
            state = 'LOGGED_IN';

            dispatch('authenticated', user);
          } else {
            dispatch('failed', data);
          }
        });
      } catch (error) {
        console.error('Failed to retrieve token', evt);
      }
    };

    window.addEventListener('message', onMessage);
    
    return () => window.removeEventListener('message', onMessage);
  });

  const doLogin = () =>
    window.open(loginUrl, "_blank", "height=377,width=606");
</script>

<div class="luna-auth-widget">
  {#if state === 'QUERY_TOKEN_SERVICE' || state === 'WAITING_FOR_TOKEN'}
    <BarLoader size="20" color="#bcb7b4" unit="px" duration="1s" />
    <iframe 
      bind:this={iframe}
      title="iiif-auth-iframe"
      src={tokenUrl} />
  {:else if state === 'LOGGED_OUT'}
    <a class="login" href={loginUrl}>
      <span class="label">Login</span> 
      <span class="icon">
        <Icon src={FiLogIn} />
      </span>
    </a>
  {:else if state === 'LOGGED_IN'}
    <span class="label">Logged in as:</span>
    <strong>{user}</strong> 
    <a href={logoutUrl} class="icon"><Icon src={FiLogOut} /></a>
  {/if}
</div>

<style>
  .luna-auth-widget {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: #574b45;
    color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 18px rgba(0,0,0,0.2);
    min-width: 200px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .luna-auth-widget .label {
    color: #e3e3e3;
    padding: 0 8px 0 12px;
  }

  .luna-auth-widget a {
    color: #fff;
    text-decoration: none;
  }

  .luna-auth-widget .login {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .luna-auth-widget .login:hover {
    background-color: #74665f;
  }

  .luna-auth-widget .icon {
    display: inline-block;
    padding-left: 14px;
    padding-right: 10px;
    padding-top: 4px;
  }

  .luna-auth-widget iframe {
    display: none;
  }
</style>