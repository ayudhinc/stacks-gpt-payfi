<script lang="ts">
  export let className: string = '';
</script>
<div class={`rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
  <slot />
</div>
