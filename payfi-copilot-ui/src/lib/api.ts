// API client for PayFi Copilot backend
const API_BASE = (import.meta as Record<string, any>).env?.VITE_API_BASE || 'http://localhost:8000';

export interface GenerateRequest {
  prompt: string;
  max_tokens?: number;
}
export interface CompileRequest {
  code: string;
}
export interface CompileResponse {
  success: boolean;
  diagnostics: string[];
}

async function generate(prompt: string, max_tokens = 2048): Promise<ReadableStream<Uint8Array>> {
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, max_tokens }),
  });
  if (!res.ok || !res.body) throw new Error('Failed to generate contract');
  return res.body;
}

async function compile(code: string): Promise<CompileResponse> {
  const res = await fetch(`${API_BASE}/compile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) throw new Error('Failed to compile contract');
  return res.json();
}

export const api = { generate, compile };
