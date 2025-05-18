<script lang="ts">
  export let type: 'button' | 'submit' = 'button';
  export let disabled = false;
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let variant: 'primary' | 'secondary' = 'primary';
</script>
<button
  type={type}
  class={`inline-flex items-center justify-center font-medium rounded transition focus:outline-none focus:ring-2 focus:ring-offset-2
    ${variant === 'primary'
      ? 'bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-400'
      : 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 focus:ring-gray-400'}
    ${size === 'sm' ? 'px-2 py-1 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-base'}
    disabled:opacity-50`}
  disabled={disabled}
>
  <slot />
</button>
