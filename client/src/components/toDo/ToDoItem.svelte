<script>
  export let title = '';
  export let body = '';
</script>

<style>

</style>

<div class="row">
  <div class="col s12 m6">
    <div class="card">
      <div class="card-content">
        <span class="card-title">{title}</span>
        <p>{body}</p>
      </div>
      <div class="card-action">
        <a href="#">Complete</a>
        <a href="#">Edit</a>
        <a href="#">Delete</a>
      </div>
    </div>
  </div>
</div>
