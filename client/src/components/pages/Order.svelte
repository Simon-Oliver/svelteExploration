<script>
  import OrderInput from '../OrderInput.svelte';
  import OrderDisplay from '../OrderDisplay.svelte';
</script>

<style>
  .order-container {
    display: flex;
    height: 80vh;
    justify-content: space-between;
  }
</style>

<div class="order-container">
  <OrderDisplay />
  <OrderInput />
</div>
