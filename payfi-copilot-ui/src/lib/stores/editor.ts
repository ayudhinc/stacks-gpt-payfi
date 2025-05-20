import { writable, get } from 'svelte/store';

export const editorStore = writable({
  isOpen: false
});

export function toggleEditor() {
  const currentState = get(editorStore).isOpen;
  setEditorOpen(!currentState);
}

export function setEditorOpen(isOpen: boolean) {
  // Update URL to reflect editor state
  if (isOpen) {
    history.pushState({}, '', '/?editor=open');
  } else {
    history.pushState({}, '', '/');
  }
  
  editorStore.update(store => ({
    ...store,
    isOpen
  }));
}
