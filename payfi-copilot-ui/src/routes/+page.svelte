<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { promptStore, codeStore } from '$lib/stores';
  import { getRandomGreeting } from '$lib/utils/greetings';
  import { get } from 'svelte/store';
  import { Loader } from 'lucide-react';
  import Button from '$lib/ui/Button.svelte';
  import Card from '$lib/ui/Card.svelte';
  import PromptSuggestions from '$lib/components/PromptSuggestions.svelte';
  let chatInput = '';
  let chatHistory: { role: 'user' | 'copilot'; message: string }[] = [];
  let streaming = false;
  let showSuggestions = true;

  $: chatInput = $promptStore;

  async function sendMessage() {
    const trimmedInput = chatInput.trim();
    if (!trimmedInput) return;
    
    chatHistory = [...chatHistory, { role: 'user', message: trimmedInput }];
    showSuggestions = false;
    streaming = true;
    promptStore.set(trimmedInput);
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
    showSuggestions = chatHistory.length === 0;
  }
</script>

<div class="min-h-full flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <div class="flex-1 overflow-y-auto p-4">
    <div class="max-w-3xl mx-auto">
      {#if showSuggestions}
        <div class="mt-16 mb-8">
          <h2 class="text-2xl font-semibold text-center mb-6">{getRandomGreeting()}</h2>
          <PromptSuggestions bind:showSuggestions />
        </div>
      {:else if chatHistory.length === 0}
        <div class="flex items-center justify-center h-64 text-gray-400">
          <p>Send a message to get started</p>
        </div>
      {/if}

      <!-- Chat messages -->
      <div class="space-y-6 mb-24">
        {#each chatHistory as msg}
          <div class="group w-full text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
            <div class="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-3xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
              <div class={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-200' 
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
              }`}>
                {#if msg.role === 'user'}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
                  </svg>
                {/if}
              </div>
              <div class="prose dark:prose-invert max-w-none">
                <p class="whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Input area -->
  <div class="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50">
    <div class="max-w-3xl mx-auto p-4">
      <form 
        class="flex items-end gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 p-1.5"
        on:submit|preventDefault={sendMessage}
      >
        <div class="flex-1 relative min-h-[2.5rem]">
          <div 
            class="invisible whitespace-pre-wrap break-words p-2 max-w-full pointer-events-none"
            style="min-height: 1.5rem;"
          >
            {chatInput || ' '}
            {#if chatInput.endsWith('\n')}
              <br />
            {/if}
          </div>
          <textarea
            class="absolute top-0 left-0 w-full h-full p-2 bg-transparent border-0 focus:ring-0 resize-none overflow-hidden"
            rows="1"
            bind:value={chatInput}
            placeholder="Message ChatPayFi..."
            disabled={streaming}
            on:keydown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !streaming) {
                e.preventDefault();
                sendMessage();
              }
            }}
            on:input={(e) => {
              const target = e.target as HTMLTextAreaElement;
              // Reset height to auto to get the correct scrollHeight
              target.style.height = 'auto';
              // Set new height, but cap at 200px
              target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
            }}
          ></textarea>
        </div>
        <button
          class="p-2 rounded-md text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={streaming || !chatInput.trim()}
          aria-label="Send message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
      <p class="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
        ChatPayFi can make mistakes. Consider checking important information.
      </p>
    </div>
  </div>
  
  <!-- Floating Action Buttons -->
  <div class="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4">
    <a 
      href="/editor" 
      class="flex items-center justify-center w-12 h-12 rounded-full bg-sky-600 hover:bg-sky-700 text-white shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
      aria-label="Open Editor"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </a>
    
    <a 
      href="https://ayudh.ai" 
      target="_blank" 
      rel="noopener" 
      aria-label="Visit ayudh.ai"
      class="relative group"
    >
      <span class="relative flex items-center justify-center rounded-full shadow-2xl">
        <span class="absolute inset-0 rounded-full border-4 border-emerald-400 opacity-70 animate-green-pulse"></span>
        <img 
          src="/ayudh.png" 
          alt="Ayudh Logo" 
          class="w-12 h-12 object-contain rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700" 
        />
      </span>
    </a>
  </div>
  
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
    
    /* Smooth transitions for suggestions */
    .suggestion-enter-active, .suggestion-leave-active {
      transition: all 0.3s ease;
    }
    .suggestion-enter-from, .suggestion-leave-to {
      opacity: 0;
      transform: translateY(10px);
    }
    
    /* Scrollbar styling */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #666;
    }
  </style>
</div>
