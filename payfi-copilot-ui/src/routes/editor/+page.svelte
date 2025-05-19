<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';
  import Monaco from '$lib/Monaco.svelte';
  import { codeStore, compileStateStore } from '$lib/stores';
  import { api } from '$lib/api';
  import { edgeDeploy } from '$lib/edge-deploy';
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

<div class="min-h-full flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
  <div class="max-w-5xl mx-auto w-full flex-1 flex flex-col py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Clarity Contract Editor</h1>
        <p class="text-gray-500 dark:text-gray-400">Edit and deploy your Clarity smart contracts</p>
      </div>
      <Button 
        variant="secondary"
        on:click={() => window.location.href = '/'}
        class="flex items-center gap-2"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Chat
      </Button>
    </div>

    <div class="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="flex-1 min-h-0">
        <Monaco bind:value={$codeStore} language="clarity" />
      </div>
      
      <div class="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
        <div class="flex items-center justify-between">
          <div class="flex gap-3">
            <Button 
              on:click={compile} 
              disabled={compiling}
              class="flex items-center gap-2"
            >
              {#if compiling}
                <Loader class="h-4 w-4 animate-spin" />
              {/if}
              {compiling ? 'Compiling...' : 'Compile'}
            </Button>
            <Button 
              variant="success"
              on:click={deploy} 
              disabled={!canDeploy || deploying}
              class="flex items-center gap-2"
            >
              {#if deploying}
                <Loader class="h-4 w-4 animate-spin" />
              {/if}
              {deploying ? 'Deploying...' : 'Deploy Contract'}
            </Button>
          </div>
        </div>

        {#if $compileStateStore.diagnostics?.length > 0}
          <div class="mt-4 p-3 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Compilation Errors</h3>
            <div class="space-y-1 text-sm">
              {#each $compileStateStore.diagnostics as diag}
                <div class="text-red-700 dark:text-red-300 font-mono text-xs">{diag}</div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
