<script lang="ts">
import "../app.css";
import { onMount } from 'svelte';
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
onMount(() => {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') applyDarkMode(true);
  else if (saved === 'light') applyDarkMode(false);
  else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyDarkMode(prefersDark);
  }
});
</script>

<div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
  <nav class="flex items-center justify-between px-4 py-2 border-b border-gray-700 shadow-lg">
    <div class="flex items-center gap-2">
      <img src="/stacks_payfi_logo.png" alt="PayFi Copilot Logo" class="w-10 h-10 object-contain bg-white rounded shadow" />
      <span class="font-bold text-xl text-gray-900 dark:text-white">PayFi Copilot</span>
    </div>
    <button class="rounded px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200" on:click={toggleDark}>
      {dark ? '🌙' : '☀️'}
    </button>
  </nav>
  <slot />
</div>
