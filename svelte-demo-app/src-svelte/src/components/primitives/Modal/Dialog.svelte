<script type="ts">
  import ModalButtonBar from './ModalButtonBar.svelte'
  export let message

  export let response = (resp) => {}
  export let cancel = 'Cancel'
  export let ok = 'OK'

  function _accept() {
    response(true)
  }

  function _cancel() {
    response(false)
  }
</script>

<div class="add-media-modal">
  <div class="content" on:click={() => _accept()}>{message}</div>
</div>

<ModalButtonBar>
  {#if cancel}
    <div class="dialog-button" on:click={() => _cancel()}>
      <div class="msg">{cancel}</div>
    </div>
  {/if}
  <div class="dialog-button" on:click={() => _accept()}>
    <div class="msg">{ok}</div>
  </div>
</ModalButtonBar>

<style type="text/scss">
  .add-media-modal {
    min-width: 100%;
    max-width: 80vh;
    min-height: 120px;
    text-align: center;
  }
  .content {
    min-width: 320px;
    padding: 20px;
    padding-top: 50px;
  }
  .dialog-button {
    flex: 1 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 52px;
    background-color: gray;
    color: silver;
    font-size: 17px;
    text-align: center;
    font-weight: bold;
    cursor: pointer;
    background-color: var(--primaryColor);
    color: var(--primaryColorContrast);
  }
</style>
