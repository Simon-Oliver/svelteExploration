<script>
  import Papa from 'papaparse';
  import Table from '../Table.svelte';
  import Modal from '../Modal.svelte';

  let data = [];
  let showModal = true;
  $: isData = data.length !== 0;
  let selected = {};

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

  const handelSelect = e => {
    const index = e.detail.target.parentElement.id;
    selected = data[index];
    console.log(selected);

    convertToText(employerTxT, selected);
  };

  const convertToText = (text, data) => {
    let newText = text.replace(/{employerName}/g, data['employerName']);
    newText = newText.replace(/{userName}/g, data['userName']);

    console.log(newText);
  };

  const employerTxT = 'Hi {employerName} we need the TP for {userName}';
</script>

<style>

</style>

{#if showModal}
  <Modal on:close={() => (showModal = false)}>
    <h4 slot="body">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, ex quae? Iste harum dignissimos
      quos commodi sapiente quaerat sunt nobis voluptate et asperiores architecto, amet, adipisci
      tenetur natus excepturi nam.
    </h4>
  </Modal>
{/if}

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
    <Table {data} on:select={handelSelect} />
  {:else}
    <p>Please uploade some data</p>
  {/if}
</div>
