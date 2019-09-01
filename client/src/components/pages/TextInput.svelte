<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  export let bodyText = '';
</script>

<div class="row">
  <form class="col s12">
    <div class="row">
      <div class="input-field col s12">
        <textarea
          id="textarea1"
          class="materialize-textarea"
          bind:value={bodyText}
          on:change={() => dispatch('textInput', bodyText)} />
        <label for="textarea1">Textarea</label>
      </div>
    </div>
  </form>
</div>
