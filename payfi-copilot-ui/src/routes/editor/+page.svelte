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
    

    <!-- Editor Area -->
    <div class="flex-1 flex flex-col min-h-0">
      <div class="flex-1 overflow-auto">
        <Monaco bind:value={$codeStore} language="clarity" class="h-full w-full" />
      </div>
    </div>
    
    <!-- Editor Header with Controls -->
    <div class="sticky top-0 z-20 border-b border-zinc-800/50 p-3 bg-zinc-900/90 backdrop-blur-sm">
      <div class="flex items-center justify-between max-w-7xl mx-auto px-4">
        <!-- Editor Bottons -->
        <div class="flex items-center gap-3">
          <Button 
            on:click={compile} 
            disabled={compiling}
            variant="outline"
            size="sm"
            class="gap-1.5 px-3 py-1 bg-zinc-800/80 hover:bg-zinc-700/80 border-zinc-700 text-white hover:text-white shadow"
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
            class="gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow hover:shadow-md"
          >
            {#if deploying}
              <Loader class="h-3.5 w-3.5 animate-spin" />
            {/if}
            {deploying ? 'Deploying...' : 'Deploy'}
          </Button>
        </div>

        <div class="flex items-center gap-3">
          <!--  -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-sky-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          <div>
            <div class="flex items-center gap-1.5 text-xs text-zinc-400">
              <kbd class="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono">Ctrl+S</kbd>
              <span>to save</span>
            </div>
          </div>
        </div>
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
