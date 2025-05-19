<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { promptStore, codeStore } from '$lib/stores';
  import { get } from 'svelte/store';
  import { Loader } from 'lucide-react';
  import Button from '$lib/ui/Button.svelte';
  import Card from '$lib/ui/Card.svelte';
  let chatInput = '';
  let chatHistory: { role: 'user' | 'copilot'; message: string }[] = [];
  let streaming = false;

  $: chatInput = $promptStore;

  async function sendMessage() {
    if (!chatInput.trim()) return;
    chatHistory = [...chatHistory, { role: 'user', message: chatInput }];
    streaming = true;
    promptStore.set(chatInput);
    let streamedCode = '';
    try {
      const stream = await api.generate(chatInput);
      if (stream && window.TextDecoder) {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          if (value) {
            streamedCode += decoder.decode(value, { stream: true });
            codeStore.set(streamedCode);
          }
          done = doneReading;
        }
        codeStore.set(streamedCode);
        chatHistory = [...chatHistory, { role: 'copilot', message: streamedCode }];
      } else {
        const text = await stream.text();
        streamedCode = text;
        codeStore.set(streamedCode);
        chatHistory = [...chatHistory, { role: 'copilot', message: streamedCode }];
      }
    } catch (e) {
      chatHistory = [...chatHistory, { role: 'copilot', message: 'Error: ' + (e instanceof Error ? e.message : e) }];
    }
    streaming = false;
    chatInput = '';
    promptStore.set('');
  }
</script>

<main class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white p-4">
  <img src="/stacks_payfi_logo.png" alt="ChatPayFi Logo" class="w-32 h-32 mb-8 object-contain bg-white rounded shadow" />
  <h1 class="text-4xl font-bold mb-4">ChatPayFi</h1>
  <p class="mb-8 text-center max-w-xl text-lg opacity-80">AI-assisted Clarity contract builder. Start by chatting with the Copilot to generate your contract.</p>
  <div class="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-4 shadow-lg border border-gray-200 dark:border-gray-700">
    <div class="flex-1 overflow-y-auto max-h-64">
      {#each chatHistory as msg}
        <div class="mb-2">
          <span class="font-bold {msg.role === 'user' ? 'text-sky-300' : 'text-emerald-300'}">{msg.role === 'user' ? 'You' : 'Copilot'}:</span>
          <span class="ml-2 whitespace-pre-wrap">{msg.message}</span>
        </div>
      {/each}
    </div>
    <form class="flex gap-2" on:submit|preventDefault={sendMessage}>
      <textarea
        class="flex-1 rounded p-2 resize-none border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
        rows="2"
        bind:value={chatInput}
        placeholder="Describe your contract..."
        disabled={streaming}
      ></textarea>
      <button
        class="px-4 py-2 rounded bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white shadow focus:outline-none focus:ring-2 focus:ring-sky-400"
        type="submit"
        disabled={streaming || !chatInput.trim()}
      >{streaming ? 'Generating…' : 'Send'}</button>
    </form>
    <button class="mt-2 text-sky-400 hover:underline" on:click={() => goto('/editor')}>Open in Editor</button>
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
