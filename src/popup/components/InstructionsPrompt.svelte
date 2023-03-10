<script>
  let showMessage = !Boolean(localStorage.getItem('r8s-disable-ai-prompt'));

  const onHideMessage = () => {
    localStorage.setItem('r8s-disable-ai-prompt', 'true');
    showMessage = false;
  }
</script>

{#if showMessage}
  <div class="r8s-edit-instructions">
    <strong>Transcribed by Artificial Intelligence.</strong> Please 
    help improve our data by confirming or 
    correcting. <a href="#">Learn more</a> · <button on:click={onHideMessage}>Hide message</button>
  </div>
{/if}

<style>
  .r8s-edit-instructions {
    background-color: var(--instructions-bg);
    border-top: 1px solid var(--instructions-border);
    color: var(--instructions-font);
    line-height: 140%;
    padding: 14px;
  }

  .r8s-edit-instructions a {
    color: var(--instructions-font);
  }

  button {
    background:none;
    border: none;
    border-radius: 3px;
    color: var(--instructions-font);
    cursor: pointer;
    font-weight: bold;
    padding: 0;
    text-decoration: underline;
  }
</style>