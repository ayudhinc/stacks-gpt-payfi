<script lang="ts">
  import { suggestedPrompts } from '$lib/stores/prompts';
  import { promptStore } from '$lib/stores';
  import { onMount } from 'svelte';
  
  export let showSuggestions = true;
  
  let randomPrompts: Array<{title: string; description: string; prompt: string}> = [];
  
  // Function to get a random selection of prompts
  function getRandomPrompts(prompts: Array<{title: string; description: string; prompt: string}>, count: number) {
    const shuffled = [...prompts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  // Update random prompts when the store changes
  $: if ($suggestedPrompts.length > 0) {
    randomPrompts = getRandomPrompts($suggestedPrompts, 4);
  }
  
  // Initial load
  onMount(() => {
    randomPrompts = getRandomPrompts($suggestedPrompts, 4);
  });
  
  function handlePromptClick(prompt: string) {
    promptStore.set(prompt);
    showSuggestions = false;
    // Focus the input after a short delay to ensure it's in the DOM
    setTimeout(() => {
      const input = document.querySelector('textarea');
      input?.focus();
    }, 50);
  }
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
  {#each randomPrompts as prompt}
    <button
      on:click|preventDefault={() => handlePromptClick(prompt.prompt)}
      class="p-4 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors hover:shadow-md"
    >
      <div class="font-medium text-gray-900 dark:text-gray-100">{prompt.title}</div>
      <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">{prompt.description}</div>
    </button>
  {/each}
</div>
