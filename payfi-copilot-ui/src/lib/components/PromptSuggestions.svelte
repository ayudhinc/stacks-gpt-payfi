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

<div class="mt-2 flex flex-wrap justify-center gap-2 max-w-4xl mx-auto px-2">
  {#each randomPrompts as prompt}
    <button
      on:click|preventDefault={() => handlePromptClick(prompt.prompt)}
      class="text-sm px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]"
      title={`${prompt.title}: ${prompt.description}`}
    >
      {prompt.title}
    </button>
  {/each}
</div>
