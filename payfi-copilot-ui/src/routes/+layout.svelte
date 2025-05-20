<script lang="ts">
  import "../app.css";
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { editorStore, toggleEditor, setEditorOpen } from '$lib/stores/editor';
  import { get } from 'svelte/store';
  
  // Initialize editor state from URL
  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const isOpen = params.get('editor') === 'open';
    
    // Handle initial state
    if (isOpen) {
      setEditorOpen(true);
    }
    
    // Handle browser back/forward buttons
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const isOpen = params.get('editor') === 'open';
      setEditorOpen(isOpen);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  });
  
  let dark = true;
  
  function applyDarkMode(mode: boolean) {
    dark = mode;
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
  
  function toggleDark() {
    applyDarkMode(!dark);
  }
  
  function toggleDropdown() {
    const dropdown = document.getElementById('user-menu-dropdown');
    if (dropdown) {
      dropdown.classList.toggle('hidden');
    }
  }
  
  function closeDropdown() {
    const dropdown = document.getElementById('user-menu-dropdown');
    if (dropdown && !dropdown.classList.contains('hidden')) {
      dropdown.classList.add('hidden');
    }
  }
  
  // Close dropdown when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const dropdown = document.getElementById('user-menu-dropdown');
    const button = document.getElementById('user-menu-button');
    const target = event.target as HTMLElement;
    
    if (dropdown && button && 
        !dropdown.contains(target) && 
        !button.contains(target)) {
      closeDropdown();
    }
  }
  
  onMount(() => {
    // Theme setup
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') applyDarkMode(true);
    else if (saved === 'light') applyDarkMode(false);
    else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyDarkMode(prefersDark);
    }
    
    // Add click outside listener
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
</script>

<div class="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
  <header class="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <img src="/stacks_payfi_logo.png" alt="ChatPayFi Logo" class="w-10 h-10 object-contain bg-white rounded shadow" />
          <span class="ml-2 font-bold text-xl text-zinc-900 dark:text-white">ChatPayFi</span>
        </div>
        
        <div class="flex items-center space-x-4">
          <button 
            class="p-2 rounded-full text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            on:click={toggleDark}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {#if dark}
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            {:else}
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            {/if}
          </button>
          
          <div class="relative ml-2" id="user-menu">
            <button
              type="button"
              class="flex rounded-full bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              id="user-menu-button"
              aria-expanded="false"
              aria-haspopup="true"
              on:click={toggleDropdown}
            >
              <span class="sr-only">Open user menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400 hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            <!-- Dropdown menu -->
            <div 
              id="user-menu-dropdown"
              class="hidden absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabindex="-1"
            >
              <button 
                type="button"
                class="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem"
                on:click={() => {
                  goto('/');
                  closeDropdown();
                }}
              >
                Chat
              </button>
              <button 
                type="button"
                class="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem"
                on:click={() => {
                  toggleEditor();
                  closeDropdown();
                }}
              >
                {$editorStore.isOpen ? 'Close Editor' : 'Open Editor'}
              </button>
              <button 
                type="button"
                class="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem"
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  
  <main class="flex-1">
    <slot />
  </main>
</div>
