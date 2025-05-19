import { writable } from 'svelte/store';

export interface SuggestedPrompt {
  title: string;
  description: string;
  prompt: string;
  category: string;
}

export const suggestedPrompts = writable<SuggestedPrompt[]>([
  {
    title: 'Subscription Service',
    description: 'Recurring payments with a free trial period',
    prompt: 'Create a subscription contract with a 7-day free trial, then charge 10 STX per month. Include functions to cancel and check subscription status.',
    category: 'Payments'
  },
  {
    title: 'Escrow Contract',
    description: 'Secure payment handling between two parties',
    prompt: 'Create an escrow contract where a buyer can lock funds that are only released to the seller when both parties confirm the transaction is complete.',
    category: 'Security'
  },
  {
    title: 'Token Vesting',
    description: 'Gradual token release over time',
    prompt: 'Create a vesting contract that releases tokens linearly over 4 years with a 1-year cliff for team allocations.',
    category: 'Tokens'
  },
  {
    title: 'Multi-signature Wallet',
    description: 'Require multiple approvals for transactions',
    prompt: 'Create a multi-signature wallet that requires 3 out of 5 signers to approve any outgoing transactions.',
    category: 'Security'
  },
  {
    title: 'DAO Voting',
    description: 'On-chain governance for decentralized organizations',
    prompt: 'Create a DAO voting contract where token holders can propose and vote on governance decisions with a 7-day voting period.',
    category: 'Governance'
  },
  {
    title: 'NFT Marketplace',
    description: 'Buy, sell, and trade NFTs',
    prompt: 'Create an NFT marketplace contract with listing, bidding, and auction functionality, taking a 2.5% fee on all sales.',
    category: 'NFTs'
  }
]);

export const categories = writable<string[]>(['All', 'Payments', 'Security', 'Tokens', 'Governance', 'NFTs']);

export const selectedCategory = writable<string>('All');
