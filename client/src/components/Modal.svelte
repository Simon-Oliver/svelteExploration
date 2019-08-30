<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>

<style>
  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    background: #47474760;
    height: 100%;
    width: 100%;
  }

  .modal-box {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 99999;
    transform: translate(-50%, -50%);
    padding: 4em;
    border-radius: 10px;
    background: white;
  }

  .button {
    position: absolute;
    bottom: 2rem;
    right: 5rem;
  }
</style>

<!-- Modal Structure -->
<div class="modal-background" on:click={() => dispatch('close')} />

<div class="modal-box">
  <div class="modal-content">
    <slot name="body" />
    <a class="button waves-effect waves-light btn" on:click={() => dispatch('close')}>Close</a>
  </div>
</div>
