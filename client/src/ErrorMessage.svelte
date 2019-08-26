<script>
  export let error = { message: '', status: '' };
</script>

<style>

</style>

<h1>{error.status}: Whooops! Something went wrong</h1>
<p>Message: {error.message}</p>
