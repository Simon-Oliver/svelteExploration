<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  export let bodyText = '';
  export let areaLabel = 'Textarea';
</script>

<form class="col s6">
  <div class="row">
    <div class="input-field col s12">
      <textarea
        id="textarea1"
        class="materialize-textarea"
        bind:value={bodyText}
        on:change={() => dispatch('textInput', bodyText)} />
      <label for="textarea1">{areaLabel}</label>
    </div>
  </div>
</form>
