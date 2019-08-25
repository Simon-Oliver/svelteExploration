<script>
  import Header from './Header.svelte';
  import Home from './Home.svelte';
  import About from './About.svelte';

  let state = {
    Home,
    About
  };

  export const handleSelect = e => {
    selected = event.target.textContent;
  };

  let selected = 'Home';
</script>

<style>
  .app-container {
    box-sizing: border-box;
    background: lightcoral;
    height: 100vh;
    width: 100vw;
    padding: 5rem;
  }
</style>

<Header {handleSelect} />
<div class="app-container">
  <svelte:component this={state[selected]} />
</div>
