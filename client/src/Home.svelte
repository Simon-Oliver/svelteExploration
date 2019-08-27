<script>
  import ErrorMessage from './ErrorMessage.svelte';
  import { onMount } from 'svelte';

  let posts = [];
  let error = {};

  let isError = false;

  let message = {};

  onMount(async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (response.status === 200) {
      const data = await response.json();
      posts = [...posts, ...data];
    } else {
      isError = true;
      error = { message: response.statusText, status: response.status };
    }

    const helloRes = await fetch('http://localhost:8000/hello');
    const helloData = await helloRes.json();
    message = helloData;
  });
</script>

<style>

</style>

<h2>{message.message ? message.message : 'Loading...'}</h2>

{#if isError}
  <ErrorMessage {error} />
{:else}
  <ol>
    {#each posts as post}
      <li>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </li>
    {/each}
  </ol>
{/if}
