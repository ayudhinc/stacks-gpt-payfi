// src/lib/edge-deploy.ts
import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
export async function deployClarity(code: string, name: string) {
  // …build tx; use secrets.NEXT_PUBLIC_DEPLOYER_KEY…
  const txid = (await broadcastTransaction(tx, network)).txid;
  return txid;
}
