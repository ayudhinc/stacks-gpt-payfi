<script lang="ts">
  export let class: string = '';
</script>
<div class={`rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 ${class}`}>
  <slot />
</div>
