<script>
  import Papa from 'papaparse';
  import Table from '../Table.svelte';

  let data = [];
  $: isData = data.length !== 0;

  const parseData = file => {
    Papa.parse(file, {
      header: true,
      complete: function(results) {
        console.log('Finished:', results.data);
        data = results.data;
      }
    });
  };

  const handleOnSubmit = e => {
    data = [];
    e.preventDefault();
    const csvData = e.target.files[0];
    parseData(csvData);
    e.target.value = null;
  };
</script>

<style>

</style>

<div class="container">

  <form action="#">
    <div class="file-field input-field">
      <div class="btn">
        <span>File</span>
        <input type="file" on:change={handleOnSubmit} />
      </div>
      <div class="file-path-wrapper">
        <input class="file-path validate" type="text" placeholder="Upload CVS" />
      </div>
    </div>
  </form>

  {#if isData}
    <Table {data} />
  {:else}
    <p>Please uploade some data</p>
  {/if}
</div>
