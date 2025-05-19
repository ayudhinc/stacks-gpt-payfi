import { writable } from 'svelte/store';

export interface SuggestedPrompt {
  title: string;
  description: string;
  prompt: string;
  category: string;
}

export const suggestedPrompts = writable<SuggestedPrompt[]>([
  // Payments & Finance
  {
    title: 'Recurring Subscription',
    description: 'Automated billing with free trial',
    prompt: 'Create a subscription contract that charges 10 STX monthly after a 14-day free trial. Include prorated refunds and easy cancellation.',
    category: 'Payments'
  },
  {
    title: 'DeFi Yield Farming',
    description: 'Earn interest on your crypto',
    prompt: 'Create a yield farming contract that distributes rewards based on staking duration, with a 0.5% fee on withdrawals before the lock period ends.',
    category: 'DeFi'
  },
  {
    title: 'Cross-border Payment',
    description: 'Send money globally with low fees',
    prompt: 'Create a contract that locks funds in one currency and releases equivalent value in another currency using an oracle for exchange rates, with a 0.2% fee.',
    category: 'Payments'
  },

  // NFTs & Digital Assets
  {
    title: 'NFT Royalties',
    description: 'Earn from secondary sales',
    prompt: 'Create an NFT contract with 5% royalty on all secondary sales, payable to the original creator, with a whitelist for approved marketplaces.',
    category: 'NFTs'
  },
  {
    title: 'Fractional Ownership',
    description: 'Own a piece of high-value assets',
    prompt: 'Create a contract that mints 1000 tokens representing ownership in a digital artwork, allowing users to buy/sell fractions with a built-in marketplace.',
    category: 'NFTs'
  },

  // Real World Assets
  {
    title: 'Real Estate Tokenization',
    description: 'Tokenize property ownership',
    prompt: 'Create a contract that represents fractional ownership of a property, with functions for rent distribution, voting on major decisions, and secondary market trading.',
    category: 'RWA'
  },
  {
    title: 'Supply Chain Tracking',
    description: 'Transparent product journey',
    prompt: 'Create a contract that tracks a product through supply chain checkpoints, with verified updates from authorized parties and immutable history.',
    category: 'RWA'
  },

  // Social & Community
  {
    title: 'Creator Membership',
    description: 'Exclusive content for token holders',
    prompt: 'Create a membership contract that grants access to premium content for token holders, with tiered benefits based on holding duration.',
    category: 'Social'
  },
  {
    title: 'Quadratic Funding',
    description: 'Community-driven funding',
    prompt: 'Create a quadratic funding contract where community contributions are matched based on number of unique contributors, not just total amount.',
    category: 'Governance'
  },

  // Security & Identity
  {
    title: 'Decentralized Identity',
    description: 'Self-sovereign identity verification',
    prompt: 'Create a contract that issues verifiable credentials for KYC, allowing users to prove aspects of their identity without revealing personal data.',
    category: 'Identity'
  },
  {
    title: 'Time-locked Wallet',
    description: 'Restrict fund access by time',
    prompt: 'Create a wallet that only allows withdrawals after a specified date, with emergency recovery available after 30 days if the owner loses access.',
    category: 'Security'
  },

  // Gaming
  {
    title: 'Play-to-Earn Rewards',
    description: 'Earn tokens through gameplay',
    prompt: 'Create a contract that distributes tokens based on in-game achievements, with anti-cheat mechanisms and daily claim limits.',
    category: 'Gaming'
  },
  {
    title: 'NFT Staking',
    description: 'Earn rewards for holding NFTs',
    prompt: 'Create a staking contract that gives daily rewards to users who lock their NFTs, with higher rewards for rarer traits.',
    category: 'Gaming'
  }
]);

export const categories = writable<string[]>([
  'All', 
  'Payments', 
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
