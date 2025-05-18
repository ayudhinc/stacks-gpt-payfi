<script lang="ts">
  import { page } from '$app/stores';
  $: txid = $page.params.txid;
</script>

<main class="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
  <h2 class="text-2xl font-bold mb-4">Transaction Explorer</h2>
  <div class="mb-4">Transaction ID: <span class="font-mono">{txid}</span></div>
  <!-- Contract ID and pay-link UI will go here -->
</main>
