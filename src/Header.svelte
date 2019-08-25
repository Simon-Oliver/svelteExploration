<script>
  export let handleSelect;

  // function handleClick(event) {
  //   handleSelect(event.target.textContent);
  //   console.log(event.target.textContent);
  // }
</script>

<style>
  .header-container {
    display: flex;
    align-items: center;
    background: rgb(22, 22, 22);
    height: 50px;
  }

  .link-container {
    display: flex;
    justify-content: space-between;
    width: 180px;
    color: white;
    margin: 0 5rem;
  }
</style>

<div class="header-container">
  <ul on:click={handleSelect} class="link-container">
    <li class="header-link">Home</li>
    <li class="header-link">About</li>
    <li class="header-link">Contact</li>
  </ul>
</div>
