import { writable } from 'svelte/store';

export const prompt = writable('');
export const code = writable('// Your Clarity contract will appear here');
export const compileDiagnostics = writable(null);
export const deployTx = writable<{ txid: string; contractId: string } | null>(null);
