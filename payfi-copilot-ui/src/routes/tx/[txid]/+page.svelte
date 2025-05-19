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

<div class="min-h-full flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
  <div class="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center py-8">
    <Card className="w-full">
      <div class="space-y-6">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="mt-3 text-2xl font-bold text-gray-900 dark:text-white">Contract Deployed Successfully!</h2>
          <p class="mt-1 text-gray-500 dark:text-gray-400">Your smart contract has been deployed to the blockchain.</p>
        </div>

        <div class="space-y-4">
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Transaction ID</h3>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              <code class="font-mono text-sm break-all">{txid}</code>
            </div>
          </div>

          {#if contractId}
            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Contract ID</h3>
              <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                <code class="font-mono text-sm break-all">{contractId}</code>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pay Link</h3>
              <div class="flex items-center gap-2">
                <div class="flex-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-l-md border border-gray-200 dark:border-gray-700 border-r-0 overflow-hidden">
                  <code class="font-mono text-xs text-gray-700 dark:text-gray-300 break-all">{payLink}</code>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  on:click={copyLink}
                  class="rounded-l-none"
                >
                  Copy
                </Button>
              </div>
            </div>

            {#if qrSvg}
              <div class="flex flex-col items-center pt-4">
                <div class="p-4 bg-white rounded-md border border-gray-200 dark:border-gray-700">
                  <div use:html={qrSvg} />
                </div>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Scan to pay with Stacks Wallet</p>
              </div>
            {/if}
          {/if}
        </div>

        <div class="flex flex-col sm:flex-row gap-3 pt-2">
          <Button 
            on:click={() => window.open(`https://explorer.stacks.co/txid/${txid}?chain=devnet`, '_blank')}
            class="flex-1 justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View on Explorer
          </Button>
          <Button 
            variant="outline" 
            on:click={() => window.location.href = '/editor'}
            class="flex-1 justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Back to Editor
          </Button>
        </div>
      </div>
    </Card>
  </div>
</div>
