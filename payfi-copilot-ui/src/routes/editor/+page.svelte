<script lang="ts">
  import Monaco from '$lib/Monaco.svelte';
  import { code, compileDiagnostics, deployTx } from '$lib/stores';
  import { postCompile, postDeploy } from '$lib/api';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';
  let compiling = false;
  let deploying = false;
  let canDeploy = false;

  async function compile() {
    compiling = true;
    compileDiagnostics.set(null);
    try {
      const result = await postCompile(get(code));
      compileDiagnostics.set(result);
      canDeploy = result && result.success;
    } finally {
      compiling = false;
    }
  }

  async function deploy() {
    deploying = true;
    try {
      const res = await postDeploy(get(code));
      deployTx.set(res);
      goto(`/tx/${res.txid}`);
    } finally {
      deploying = false;
    }
  }
</script>

<main class="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
  <h2 class="text-2xl font-bold mb-4">Clarity Contract Editor</h2>
  <div class="w-full max-w-3xl flex flex-col gap-4">
    <Monaco bind:value={$code} language="plaintext" />
    <div class="flex gap-2">
      <button class="px-4 py-2 rounded bg-sky-600 hover:bg-sky-700 disabled:opacity-50" on:click={compile} disabled={compiling}>
        {compiling ? 'Compiling…' : 'Compile'}
      </button>
      <button class="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50" on:click={deploy} disabled={!canDeploy || deploying}>
        {deploying ? 'Deploying…' : 'Deploy'}
      </button>
    </div>
    {#if $compileDiagnostics}
      <div class="mt-2 p-2 rounded bg-gray-800 text-sm">
        <pre>{JSON.stringify($compileDiagnostics, null, 2)}</pre>
      </div>
    {/if}
  </div>
</main>
