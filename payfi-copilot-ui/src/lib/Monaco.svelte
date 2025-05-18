<script lang="ts">
  import { onMount, onDestroy, afterUpdate } from 'svelte';
  import { browser } from '$app/environment';
  import { codeStore } from './stores';
  import { get } from 'svelte/store';

  export let value = '';
  export let language = 'plaintext';
  export let readOnly = false;
  export let onChange: (v: string) => void = () => {};
  export let className = '';

  let container: HTMLDivElement;
  let editor: any;
  let monaco: any;

  onMount(async () => {
    if (!browser) return;

    // Dynamically import Monaco
    monaco = await import('monaco-editor');
    
    editor = monaco.editor.create(container, {
      value,
      language,
      theme: 'vs-dark',
      automaticLayout: true,
      readOnly,
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      formatOnPaste: true,
      formatOnType: true,
    });

    const updateValue = () => {
      const val = editor.getValue();
      if (val !== value) {
        onChange(val);
        codeStore.set(val);
      }
    };

    editor.onDidChangeModelContent(updateValue);
    updateValue();

    return () => {
      if (editor) {
        editor.dispose();
      }
    };
  });

  // Update editor when value prop changes
  let previousValue = value;
  afterUpdate(() => {
    if (editor && browser && value !== previousValue) {
      // Save cursor position
      const position = editor.getPosition();
      editor.setValue(value);
      // Restore cursor position
      if (position) {
        editor.setPosition(position);
        editor.revealPositionInCenter(position);
      }
      previousValue = value;
    }
  });

  onDestroy(() => {
    if (editor) {
      editor.dispose();
    }
  });
</script>

<div 
  bind:this={container} 
  class={`w-full h-full rounded shadow ${className}`} 
  style="min-height: 300px;"
>
  {#if !browser}
    <textarea 
      class="w-full h-full p-2 font-mono text-sm bg-gray-900 text-white rounded"
      bind:value
    ></textarea>
  {/if}
</div>
