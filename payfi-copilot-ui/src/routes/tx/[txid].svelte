<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { derived } from 'svelte/store';
  // Assume deployTx is set in store after deploy
  const txid = derived(page, $page => $page.params.txid);
  let contractId = '';
  let paylink = '';

  // You may want to fetch tx details from an API here
  $: if ($txid) {
    // Dummy contractId for now; replace with real lookup if needed
    contractId = `SP1234.example-contract`;
    paylink = `stacks://pay?amount=&contract=${contractId}`;
  }
  function copyPaylink() {
    navigator.clipboard.writeText(paylink);
  }
</script>

<main class="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
  <h2 class="text-2xl font-bold mb-4">Transaction Details</h2>
  <div class="bg-gray-800 rounded-lg p-6 flex flex-col gap-4 w-full max-w-xl">
    <div>
      <span class="font-semibold">Transaction ID:</span>
      <span class="ml-2 font-mono break-all">{$txid}</span>
    </div>
    <div>
      <span class="font-semibold">Contract ID:</span>
      <span class="ml-2 font-mono">{contractId}</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="font-semibold">Pay Link:</span>
      <input class="flex-1 bg-gray-700 rounded px-2 py-1 font-mono" readonly value={paylink} />
      <button class="px-2 py-1 bg-sky-600 rounded hover:bg-sky-700" on:click={copyPaylink}>Copy</button>
    </div>
  </div>
</main>
