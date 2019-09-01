<script>
  import Papa from 'papaparse';
  import Table from '../Table.svelte';
  import Modal from '../Modal.svelte';
  import TextInput from './TextInput.svelte';

  let data = [];
  let showModal = false;
  $: isData = data.length !== 0;
  let selected = {};

  let textOutputEMP = '';
  let textOutputAA = '';

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

    textOutputEMP = convertToText(employerTxT, selected);
    textOutputAA = convertToText(apprenticeTxT, selected);
    showModal = true;
  };

  const convertToText = (text, data) => {
    let newText = text.replace(/{employerName}/g, data['employerName']);
    newText = newText.replace(/{userName}/g, data['userName']);

    return newText;
  };

  let employerTxT = 'Hi {employerName} we need the TP for {userName}';
  let apprenticeTxT = 'Hi {userName}, we need your TP!';
</script>

<style>

</style>

{#if showModal}
  <Modal on:close={() => (showModal = false)}>
    <h5 slot="body">Employer:</h5>
    <p slot="body">{textOutputEMP}</p>
    <hr />
    <h5 slot="body">Apprentice:</h5>
    <p slot="body">{textOutputAA}</p>
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

      <div class="row">
        <TextInput
          on:textInput={item => (employerTxT = item.detail)}
          bodyText={employerTxT}
          areaLabel="Employer Message" />
        <TextInput
          on:textInput={item => (apprenticeTxT = item.detail)}
          bodyText={apprenticeTxT}
          areaLabel="Apprentice Message" />
      </div>

    </div>

  </form>

  {#if isData}
    <Table {data} on:select={handelSelect} />
  {:else}
    <p>Please uploade some data</p>
  {/if}
</div>
