<script>
  import Header from './components/pages/Header.svelte';
  import Home from './components/pages/Home.svelte';
  import About from './components/pages/About.svelte';
  import Contact from './components/pages/Contact.svelte';
  import Uploader from './components/pages/Uploader.svelte';

  let state = {
    Home,
    About,
    Contact,
    Uploader
  };

  export const handleSelect = e => {
    selected = event.target.textContent;
  };

  let selected = 'Uploader';
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
