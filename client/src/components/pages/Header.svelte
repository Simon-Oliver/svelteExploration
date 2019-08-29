<script>
  export let handleSelect;

  // function handleClick(event) {
  //   handleSelect(event.target.textContent);
  //   console.log(event.target.textContent);
  // }
</script>

<style>
  .nav.header-container {
    position: fixed;
    width: 100%;
    display: flex;
    align-items: center;
    background: rgb(22, 22, 22);
    height: 50px;
    z-index: 9999;
  }

  .link-container {
    display: flex;
    justify-content: space-between;
    width: 230px;
    color: white;
    margin: 0 5rem;
    list-style: none;
    padding: 0;
  }

  .header-link:hover {
    cursor: pointer;
  }
</style>

<div class="nav header-container">
  <ul on:click={handleSelect} class="link-container">
    <li class="header-link">Home</li>
    <li class="header-link">About</li>
    <li class="header-link">Contact</li>
    <li class="header-link">Uploader</li>
  </ul>
</div>
