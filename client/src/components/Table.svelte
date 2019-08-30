<script>
  import TableItem from './TableItem.svelte';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let data = [];
</script>

<table class="highlight" on:click={e => dispatch('select', e)}>
  <thead>
    <tr>
      <th>Name</th>
      <th>Employer</th>
      <th>Phone Number</th>
    </tr>
  </thead>
  <tbody>
    {#each data as item, index}
      <TableItem {...item} {index} />
    {/each}
  </tbody>
</table>
