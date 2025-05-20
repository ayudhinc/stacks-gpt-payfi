import { writable } from 'svelte/store';

export interface SuggestedPrompt {
  title: string;
  description: string;
  prompt: string;
  category: string;
}

export const suggestedPrompts = writable<SuggestedPrompt[]>([
  // Simple Checkout
  {
    title: 'One-time Payment',
    description: 'Basic e-commerce transaction',
    prompt: 'Create a simple payment button for a one-time payment of 25 USDC that redirects to thank-you.html after successful payment.',
    category: 'Checkout'
  },
  // Usage-based Billing
  {
    title: 'Metered API',
    description: 'Pay-per-use API access',
    prompt: 'Create a metered API contract that charges 10 sats per API call, with automatic billing every midnight UTC. Include usage tracking and rate limiting.',
    category: 'Usage-based'
  },
  // Escrow & Milestones
  {
    title: 'Escrow Service',
    description: 'Secure P2P transactions',
    prompt: 'Create an escrow contract that holds 0.2 BTC until both buyer and seller sign off, with automatic release to the vendor after 30 days if no disputes.',
    category: 'Escrow'
  },
  // Payroll & Salaries
  {
    title: 'Streaming Payroll',
    description: 'Continuous salary payments',
    prompt: 'Create a contract that streams salary payments of 0.003 BTC per block to 5 predefined employee addresses, with an emergency pause function for the employer.',
    category: 'Payroll'
  },
  // Token Sales
  {
    title: 'Token Sale (IDO)',
    description: 'Fair token distribution',
    prompt: 'Set up an IDO contract for a token sale with max 100 tickets at 0.01 BTC each, with whitelist registration open between block heights 10,000 and 11,000.',
    category: 'Fundraising'
  },
  // Treasury Management
  {
    title: 'Treasury Sweep',
    description: 'Automated fund collection',
    prompt: 'Create a contract that automatically sweeps all accumulated fees to cold wallet bc1q... every Friday at 00:00 UTC, with a 3/5 multi-sig requirement.',
    category: 'Treasury'
  },
  // Audit & Documentation
  {
    title: 'Security Audit',
    description: 'Smart contract analysis',
    prompt: 'Analyze this escrow contract for security vulnerabilities, explain the trust assumptions, and suggest improvements for dispute resolution.',
    category: 'Audit'
  }
]);

export const categories = writable<string[]>([
  'All', 
  'Checkout', 
  'Usage-based', 
  'Escrow', 
  'Payroll', 
  'Fundraising', 
  'Treasury', 
  'Audit',
  'DeFi', 
  'NFTs', 
  'RWA', 
  'Governance', 
  'Social', 
  'Identity', 
  'Security', 
  'Gaming'
]);

export const selectedCategory = writable<string>('All');
