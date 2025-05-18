<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import Button from '$lib/ui/Button.svelte';
  import Card from '$lib/ui/Card.svelte';
  let txid = '';
  let contractId = '';
  let payLink = '';
  let qrSvg = '';

  $: txid = $page.params.txid;
  $: contractId = $page.url.searchParams.get('contractId') || '';
  $: payLink = contractId ? `stacks://pay?amount=&contract=${contractId}` : '';

  onMount(async () => {
    if (payLink) {
      // Dynamically import qrcode.fy.js for SSR safety
      const { toString } = await import('qrcode.fy');
      qrSvg = toString(payLink, { type: 'svg', size: 200 });
    }
  });

  function copyLink() {
    navigator.clipboard.writeText(payLink);
  }
</script>

<main class="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
  <Card class="max-w-xl w-full flex flex-col items-center gap-4 p-6">
    <h2 class="text-2xl font-bold">Contract Deployed!</h2>
    <div class="flex flex-col gap-2 w-full">
      <div><span class="font-semibold">TxID:</span> <span class="font-mono break-all">{txid}</span></div>
      {#if contractId}
        <div><span class="font-semibold">Contract ID:</span> <span class="font-mono break-all">{contractId}</span></div>
        <div class="flex items-center gap-2">
          <span class="font-semibold">Pay Link:</span>
          <span class="font-mono text-xs break-all">{payLink}</span>
          <Button size="sm" on:click={copyLink}>Copy</Button>
        </div>
        {#if qrSvg}
          <div class="flex justify-center mt-4" use:html={qrSvg} />
        {/if}
      {/if}
    </div>
    <Button class="mt-4" on:click={() => window.open(`https://explorer.stacks.co/txid/${txid}?chain=devnet`, '_blank')}>View on Explorer</Button>
    <Button variant="secondary" on:click={() => window.location.href = '/editor'}>Back to Editor</Button>
  </Card>
</main>
