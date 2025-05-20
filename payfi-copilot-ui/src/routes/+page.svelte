<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { promptStore, codeStore } from '$lib/stores';
  import { onMount, onDestroy } from 'svelte';
  import Editor from './editor/+page.svelte';
  import { editorStore, toggleEditor } from '$lib/stores/editor';
  import { get } from 'svelte/store';
  import { getRandomGreeting } from '$lib/utils/greetings';
  import { Loader, X, Send, Edit3 } from '@lucide/svelte';
  
  let isEditorOpen = $derived($editorStore.isOpen);
  
  // Handle editor state changes
  $effect(() => {
    isEditorOpen = $editorStore.isOpen;
  });
  import Button from '$lib/ui/Button.svelte';
  import Card from '$lib/ui/Card.svelte';
  import PromptSuggestions from '$lib/components/PromptSuggestions.svelte';
  
  // Reactive state variables
  let chatInput = $state('');
  let chatHistory = $state<{ role: 'user' | 'copilot'; message: string }[]>([]);
  let streaming = $state(false);
  let showSuggestions = $state(true);
  let hasUserTyped = $state(false); // Track if user has started typing

  
  // Reset input state on page load
  onMount(() => {
    chatInput = '';
    promptStore.set('');
    hasUserTyped = false;
    return () => {
      // Cleanup if needed
    };
  });

  // Sync promptStore with chatInput
  $effect(() => {
    chatInput = $promptStore;
  });

  async function sendMessage() {
    if (!chatInput.trim() || streaming) return;
    
    const userMessage = { role: 'user' as const, message: chatInput };
    chatHistory = [...chatHistory, userMessage];
    showSuggestions = false;
    
    // Clear input immediately for better UX
    const currentInput = chatInput;
    chatInput = '';
    // Don't reset hasUserTyped here to keep the input at the bottom
    
    // Call the API
    streaming = true;
    let fullResponse = '';
    try {
      const stream = await api.generate(currentInput);
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

<div class="min-h-full flex flex-col bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 overflow-hidden">
  <div class="flex-1 overflow-y-auto relative">
    <div class={`mx-auto min-h-full flex flex-col transition-all duration-300 ${isEditorOpen ? 'max-w-[50%]' : 'max-w-3xl'}`}>
      <!-- Chat messages -->
      <div class={`space-y-6 p-4 ${chatHistory.length === 0 ? 'hidden' : 'pb-24'}`}>
        {#each chatHistory as msg}
          <div class="group w-full text-zinc-800 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800">
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
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                {/if}
              </div>
              <div class="relative flex-1">
                <p class="whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Input area -->
  <div class={`fixed left-0 right-0 transition-all duration-300 ${
    hasUserTyped ? 'bottom-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm border-t border-zinc-200/50 dark:border-zinc-700/50' 
    : 'bottom-1/2 transform translate-y-1/2 max-w-2xl mx-auto px-4 w-full flex flex-col items-center justify-center'
  }`}>
    {#if showSuggestions && chatHistory.length === 0}
      <div class="w-full max-w-2xl mx-auto px-4 mb-6 text-center">
        <!-- Light mode logo -->
        <div class="relative flex justify-center mb-8 dark:hidden" style="transform: scale(0.7); transform-origin: center;">
          <div class="absolute inset-0 bg-white dark:bg-[#0a0a0a] rounded-2xl" style="
            -webkit-mask: radial-gradient(ellipse at center, black 75%, transparent 90%);
            mask: radial-gradient(ellipse at center, black 75%, transparent 90%);
          "></div>
          <div class="relative">
            <img 
              src="/ChatPayFiLight.png" 
              alt="ChatPayFi Logo" 
              class="max-w-full h-auto"
              style="
                -webkit-mask: radial-gradient(ellipse at center, black 80%, transparent 95%);
                mask: radial-gradient(ellipse at center, black 80%, transparent 95%);
              "
            />
          </div>
        </div>
        <!-- Dark mode logo -->
        <div class="flex justify-center mb-8 hidden dark:flex" style="transform: scale(0.7); transform-origin: center;">
          <img 
            src="/ChatPayPiDark.png" 
            alt="ChatPayFi Logo" 
            class="max-w-full h-auto"
          />
        </div>
        <h2 class="text-2xl font-medium text-zinc-700 dark:text-zinc-300 mb-4 leading-relaxed">
          {getRandomGreeting()}
        </h2>
      </div>
    {:else if chatHistory.length === 0}
      <div class="w-full max-w-2xl mx-auto px-4 mb-6 text-center">
        <p class="text-zinc-500 dark:text-zinc-400">Send a message to get started</p>
      </div>
    {/if}
    <div class={`transition-all duration-300 ${
      hasUserTyped ? 'max-w-3xl mx-auto p-4' : 'w-full'
    }`}>
      <form 
        class={`flex items-end gap-2 bg-white dark:bg-[#0a0a0a] rounded-2xl border border-zinc-300 dark:border-zinc-700 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 transition-all duration-300 ${
          hasUserTyped ? 'p-1.5' : 'p-4 shadow-xl max-w-2xl mx-auto w-full'
        }`}
        onsubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
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
            class="absolute top-0 left-0 w-full h-full p-2 bg-transparent border-0 focus:ring-0 resize-none overflow-hidden text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            rows="1"
            bind:value={chatInput}
            placeholder={chatInput.trim() ? 'Message ChatPayFi...' : 'Describe the smart contract you want to create...'}
            disabled={streaming}
            onkeydown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !streaming) {
                e.preventDefault();
                sendMessage();
              }
            }}
            oninput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
              if (!hasUserTyped && target.value.trim()) {
                hasUserTyped = true;
              }
            }}
            onfocus={() => {
              if (chatInput.trim()) {
                hasUserTyped = true;
              }
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
      {#if showSuggestions && chatHistory.length === 0}
        <div class="mt-2">
          <PromptSuggestions bind:showSuggestions />
        </div>
      {/if}
    </div>
  </div>

  <!-- Editor Pane (40% width) - Slides in from right -->
  <div 
    class={`fixed top-0 right-0 h-full bg-white dark:bg-[#0a0a0a] border-l border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-300 ease-in-out z-30 shadow-2xl ${isEditorOpen ? 'translate-x-0 w-2/5' : 'translate-x-full w-2/5'}`}
  >
    <div class="h-full flex flex-col">
      <div class="border-b border-zinc-200/50 dark:border-zinc-800/50 p-4 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm flex justify-between items-center">
        <div class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-sky-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Smart Contract Editor</h2>
        </div>
        <button 
          onclick={toggleEditor}
          class="p-1.5 rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-500 dark:hover:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-colors"
          aria-label="Close editor"
        >
          <X size={18} />
        </button>
      </div>
      <div class="flex-1 overflow-hidden flex flex-col">
        {#if isEditorOpen}
          <div class="h-full flex flex-col">
            <div class="flex-1 overflow-auto">
              <Editor />
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Floating Action Buttons -->
  <div class="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4">
    <button 
      onclick={toggleEditor}
      class="flex items-center justify-center w-12 h-12 rounded-full bg-sky-600 hover:bg-sky-700 text-white shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
      aria-label="Toggle Editor"
    >
      <Edit3 size={24} />
    </button>
    
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
