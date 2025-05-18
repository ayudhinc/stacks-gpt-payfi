<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as monaco from 'monaco-editor';
  import { code } from './stores';
  import { get } from 'svelte/store';

  export let value: string = '';
  export let language: string = 'plaintext';
  export let readOnly = false;
  export let onChange: (v: string) => void = () => {};

  let container: HTMLDivElement;
  let editor: monaco.editor.IStandaloneCodeEditor;

  onMount(() => {
    editor = monaco.editor.create(container, {
      value,
      language,
      theme: 'vs-dark',
      automaticLayout: true,
      readOnly,
      fontSize: 14,
      minimap: { enabled: false },
    });
    editor.onDidChangeModelContent(() => {
      const val = editor.getValue();
      onChange(val);
      code.set(val);
    });
    code.set(editor.getValue());
    return () => editor.dispose();
  });
  onDestroy(() => editor?.dispose());
</script>

<div bind:this={container} class="w-full h-full rounded shadow" style="min-height:300px;"></div>
