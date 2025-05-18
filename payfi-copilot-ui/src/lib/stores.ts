import { writable, type Writable } from 'svelte/store';

function persistentStore<T>(key: string, initial: T): Writable<T> {
  let startValue = initial;
  if (typeof localStorage !== 'undefined') {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      try { startValue = JSON.parse(raw); } catch {}
    }
  }
  const store = writable<T>(startValue);
  store.subscribe((val) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(val));
    }
  });
  return store;
}

export const promptStore = persistentStore<string>('payfi-prompt', '');
export const codeStore = persistentStore<string>('payfi-code', '// Your Clarity contract will appear here');

export interface CompileState {
  loading: boolean;
  diagnostics: string[];
  success: boolean;
}

export const compileStateStore = writable<CompileState>({ loading: false, diagnostics: [], success: false });
