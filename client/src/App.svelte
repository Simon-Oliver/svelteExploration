<script>
  import Header from './Header.svelte';
  import Home from './Home.svelte';
  import About from './About.svelte';
  import Contact from './Contact.svelte';

  let state = {
    Home,
    About,
    Contact
  };

  export const handleSelect = e => {
    selected = event.target.textContent;
  };

  let selected = 'Home';
</script>

<style>
  .app-container {
    box-sizing: border-box;
    height: 100vh;
    width: 100vw;
  }

  main {
    padding: 5rem;
  }
</style>

<div class="app-container">
  <Header {handleSelect} />
  <main>
    <svelte:component this={state[selected]} />
  </main>

</div>
