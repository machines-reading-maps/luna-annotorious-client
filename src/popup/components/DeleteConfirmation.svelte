<script>
  import { createEventDispatcher } from 'svelte';
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import CgClose from 'svelte-icons-pack/cg/CgClose';

  const dispatch = createEventDispatcher();

  const onDelete = () => dispatch('delete');

  const onCancel = () => dispatch('cancel');
</script>

<div class="modal-wrapper">
  <div class="modal">
    <button class="close" on:click={onCancel}>
      <Icon src={CgClose} />
    </button>

    <h1>Confirm Delete</h1>
    <p>
      Are you sure you want to delete this transcription?
    </p>

    <div class="buttons">
      <button class="cancel" on:click={onCancel}>
        Cancel
      </button>

      <button class="delete" on:click={onDelete}>
        Delete
      </button>
    </div>
  </div>
</div>

<style>
  .modal-wrapper {
    align-items: center;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    font-family: Arial, Helvetica, sans-serif;
    height: 100vh;
    justify-content: center;
    left: 0;
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: 999;
  }

  .modal {
    background-color: #fff;
    border-radius: var(--border-radius);
    box-shadow:1px 1px 24px rgba(0, 0, 0, 0.65);
    padding: 30px;
    position: relative;
    width: 480px;
  }

  h1 {
    font-size: 1.4em;
    margin: 0;
    padding: 0;
  }

  p {
    margin: 0;
    padding: 3em 0;
  }

  button {
    background: none;
    border: none;
    color: var(--bright-blue);
    cursor: pointer;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    outline: none;
  }

  button.close {
    font-size: 24px;
  }

  button.cancel {
    border-radius: var(--border-radius);
    padding: 10px 20px;
  }

  button.cancel:hover {
    background-color: rgba(66, 133, 244, 0.15);
  }

  button.delete {
    background-color: var(--bright-blue);
    border-radius: var(--border-radius);
    color: #fff;
    padding: 10px 20px;
  }

  .close {
    position: absolute;
    right: 20px;
    top: 20px;
  }

  .buttons {
    text-align: right;
  }
</style>