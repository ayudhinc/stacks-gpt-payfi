<script lang="ts">
  import Monaco from '$lib/Monaco.svelte';
  import { codeStore, compileStateStore } from '$lib/stores';
  import { api } from '$lib/api';
  import { edgeDeploy } from '$lib/edge-deploy';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';
  import Button from '$lib/ui/Button.svelte';
  import Card from '$lib/ui/Card.svelte';
  import Alert from '$lib/ui/Alert.svelte';
  import { Loader } from 'lucide-react';
  
  let compiling = false;
  let deploying = false;
  
  // Use the store directly with $ syntax
  $: canDeploy = $compileStateStore.success;

  async function compile() {
    compiling = true;
    compileStateStore.set({ loading: true, diagnostics: [], success: false });
    try {
      const result = await api.compile($codeStore);
      compileStateStore.set({
        loading: false,
        diagnostics: result.diagnostics || [],
        success: result.success,
      });
    } catch (e) {
      compileStateStore.set({
        loading: false,
        diagnostics: [e instanceof Error ? e.message : String(e)],
        success: false,
      });
    } finally {
      compiling = false;
    }
  }

  async function deploy() {
    deploying = true;
    try {
      const { txid, contractId } = await edgeDeploy($codeStore);
      goto(`/tx/${txid}?contractId=${encodeURIComponent(contractId)}`);
    } catch (e) {
      compileStateStore.set({
        loading: false,
        diagnostics: [e instanceof Error ? e.message : String(e)],
        success: false,
      });
    } finally {
      deploying = false;
    }
  }
</script>

<main class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white p-4">
  <img src="/stacks_payfi_logo.png" alt="ChatPayFi Logo" class="w-20 h-20 mb-4 object-contain bg-white rounded shadow" />
  <h2 class="text-2xl font-bold mb-4">Clarity Contract Editor</h2>
  <div class="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-4 shadow-lg border border-gray-200 dark:border-gray-700">
    <button class="self-start mb-2 flex items-center gap-2 px-3 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-400" on:click={() => goto('/')}>⬅ Back to Chat</button>
    <Monaco bind:value={$codeStore} language="clarity" />
    <div class="flex gap-2">
      <button class="px-4 py-2 rounded bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white shadow focus:outline-none focus:ring-2 focus:ring-sky-400" on:click={compile} disabled={compiling}>
        {compiling ? 'Compiling…' : 'Compile'}
      </button>
      <button class="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow focus:outline-none focus:ring-2 focus:ring-emerald-400" on:click={deploy} disabled={!canDeploy || deploying}>
        {deploying ? 'Deploying…' : 'Deploy'}
      </button>
    </div>
    {#if $compileStateStore.diagnostics?.length > 0}
      <div class="mt-2 p-2 rounded bg-gray-100 dark:bg-gray-800 text-sm border border-red-200 dark:border-red-800">
        <pre class="whitespace-pre-wrap">
          {#each $compileStateStore.diagnostics as diag}
            <div class="text-red-600 dark:text-red-400">{diag}</div>
          {/each}
        </pre>
      </div>
    {/if}
  </div>
  <a href="https://ayudh.ai" target="_blank" rel="noopener" aria-label="Visit ayudh.ai"
    class="fixed bottom-6 right-6 z-50 group">
    <span class="relative flex items-center justify-center rounded-full shadow-2xl">
      <span class="absolute inset-0 rounded-full border-4 border-emerald-400 opacity-70 animate-green-pulse"></span>
      <img src="/ayudh.png" alt="Ayudh Logo" class="w-12 h-12 object-contain rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700" />
    </span>
  </a>
  <style>
    @keyframes green-pulse {
      0% {
        transform: scale(1);
        opacity: 0.7;
      }
      70% {
        transform: scale(1.6);
        opacity: 0;
      }
      100% {
        transform: scale(1.6);
        opacity: 0;
      }
    }
    .animate-green-pulse {
      animation: green-pulse 1.6s cubic-bezier(0.4,0,0.2,1) infinite;
    }
  </style>
</main>
