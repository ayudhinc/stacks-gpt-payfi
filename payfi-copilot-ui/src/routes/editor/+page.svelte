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

<div class="min-h-full flex flex-col bg-[#0a0a0a] text-zinc-100">
  <div class="flex-1 flex flex-col max-w-full h-full">
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Editor Header -->
      <div class="border-b border-zinc-800/50 p-4 bg-[#0a0a0a]/80 backdrop-blur-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-sky-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            <div>
              <h1 class="text-lg font-semibold text-zinc-100">Clarity Contract Editor</h1>
              <p class="text-xs text-zinc-400">Edit and deploy your smart contracts</p>
            </div>
          </div>
          <Button 
            variant="ghost"
            on:click={() => window.history.back()}
            class="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Chat
          </Button>
        </div>
      </div>

      <!-- Editor Area -->
      <div class="flex-1 overflow-hidden">
        <Monaco bind:value={$codeStore} language="clarity" class="h-full" />
      </div>
      
      <!-- Editor Footer -->
      <div class="border-t border-zinc-800/50 p-3 bg-zinc-900/50">
        <div class="flex items-center justify-between">
          <div class="text-xs text-zinc-500">
            <span class="inline-flex items-center gap-1.5">
              <kbd class="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono">Ctrl+S</kbd>
              <span>to save</span>
            </span>
          </div>
          <div class="flex items-center gap-2">
            <Button 
              on:click={compile} 
              disabled={compiling}
              variant="outline"
              size="sm"
              class="gap-1.5"
            >
              {#if compiling}
                <Loader class="h-3.5 w-3.5 animate-spin" />
              {/if}
              {compiling ? 'Compiling...' : 'Compile'}
            </Button>
            <Button 
              variant="success"
              on:click={deploy} 
              disabled={!canDeploy || deploying}
              size="sm"
              class="gap-1.5"
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
