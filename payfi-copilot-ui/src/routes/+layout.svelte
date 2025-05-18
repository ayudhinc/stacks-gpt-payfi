<script lang="ts">
import "../app.css";
let dark = true;
function toggleDark() {
  dark = !dark;
  document.documentElement.classList.toggle('dark', dark);
}
</script>

<div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
  <nav class="flex items-center justify-between px-4 py-2 border-b border-gray-700">
    <div class="flex items-center gap-2">
      <img src="/logo.svg" alt="PayFi Copilot Logo" class="w-8 h-8" />
      <span class="font-bold text-xl text-gray-900 dark:text-white">PayFi Copilot</span>
    </div>
    <button class="rounded px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200" on:click={toggleDark}>
      {dark ? '🌙' : '☀️'}
    </button>
  </nav>
  <slot />
</div>
