<script lang="ts">
  export let type: 'error' | 'info' | 'success' = 'info';
  export let className: string = '';
</script>
<div class={`flex items-center gap-2 rounded border-l-4 p-3 mb-2
  ${type === 'error' ? 'bg-red-100 border-red-500 text-red-900' : ''}
  ${type === 'info' ? 'bg-blue-100 border-blue-500 text-blue-900' : ''}
  ${type === 'success' ? 'bg-emerald-100 border-emerald-500 text-emerald-900' : ''}
  ${className}`.trim()}>
  <slot />
</div>
