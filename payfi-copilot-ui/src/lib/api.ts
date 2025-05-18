// Typed fetch helpers for PayFi Copilot backend
export async function postGenerate(prompt: string) {
  const res = await fetch('http://localhost:8000/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error('Failed to generate contract');
  return res.body; // stream
}

export async function postCompile(code: string) {
  const res = await fetch('http://localhost:8000/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) throw new Error('Failed to compile contract');
  return res.json();
}

export async function postDeploy(code: string) {
  const res = await fetch('http://localhost:8000/deploy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) throw new Error('Failed to deploy contract');
  return res.json();
}
