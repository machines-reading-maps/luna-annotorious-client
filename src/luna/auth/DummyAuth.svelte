<script type="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { API_BASE } from '@/config';

  const dispatch = createEventDispatcher();

  let state = 'CHECKING';
  let username = null;

  onMount(() => {
    // Performs a 'login' against the dummy API token endpoint
    fetch(`${API_BASE}/login`).then(res => res.json())
      .then(({ token }) => {
        fetch(`${API_BASE}/me`).then(res => res.json())
          .then(data => {
            state = 'LOGGED_IN';
            username = data.fullname;

            dispatch('authenticated', data);
          });
      }).catch(error => {
        console.log('Something went wrong during login');
        state = 'LOGGED_OUT';
      });
  });
</script>

<div class="dummy-auth-widget">
  {#if state === 'CHECKING'}
    Checking...
  {:else if state === 'LOGGED_OUT'}
    Not logged in
  {:else if state === 'LOGGED_IN'}
    Logged in as: {username}
  {/if}
</div>

<style>
  .dummy-auth-widget {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: #fff;
    padding: 10px 14px;
    border-radius: 3px;
    box-shadow: 1px 1px 12px rgba(0,0,0,0.2);
  }
</style>