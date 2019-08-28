<script>
  import ToDoItem from '../toDo/ToDoItem.svelte';

  let obj = [
    { title: 'Test One Two', body: 'Test Body' },
    { title: 'Test One Two', body: 'Test Body' },
    { title: 'Test One Two', body: 'Test Body' },
    { title: 'Test One Two', body: 'Test Body' },
    { title: 'Test One Two', body: 'Test Body' },
    { title: 'Test One Two', body: 'Test Body' },
    { title: 'Test One Two', body: 'Test Body' },
    { title: 'Test One Two', body: 'Test Body' },
    { title: 'Test One Two', body: 'Test Body' },
    { title: 'Test One Two', body: 'Test Body' }
  ];
</script>

<style>

</style>

<h3>ToDo Page</h3>

{#each obj as item}
  <ToDoItem {...item} />
{/each}
