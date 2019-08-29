<script>
  import TableItem from './TableItem.svelte';
  export let data = [];
</script>

<table class="highlight">
  <thead>
    <tr>
      <th>Name</th>
      <th>Employer</th>
      <th>Phone Number</th>
    </tr>
  </thead>
  <tbody>
    {#each data as item}
      <TableItem {...item} />
    {/each}
  </tbody>
</table>
