// src/lib/edge-deploy.ts
import {
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode,
  StacksTestnet,
} from '@stacks/transactions';

const STACKS_NODE = (import.meta as Record<string, any>).env?.VITE_STACKS_NODE || 'http://localhost:3999';
const DEPLOYER_KEY = (import.meta as Record<string, any>).env?.VITE_DEPLOYER_KEY || '';
const DEPLOYER_ADDRESS = (import.meta as Record<string, any>).env?.VITE_DEPLOYER_ADDRESS || '';

function randomContractName() {
  return 'ai_' + Math.random().toString(36).slice(2, 10);
}

export async function edgeDeploy(code: string, name?: string): Promise<{ txid: string; contractId: string }> {
  if (!DEPLOYER_KEY) throw new Error('VITE_DEPLOYER_KEY not set');
  const contractName = name || randomContractName();
  const network = new StacksTestnet({ url: STACKS_NODE });
  const tx = await makeContractDeploy({
    contractName,
    codeBody: code,
    senderKey: DEPLOYER_KEY,
    anchorMode: AnchorMode.Any,
    network,
  });
  const res = await broadcastTransaction(tx, network);
  if (typeof res !== 'object' || !('txid' in res)) {
    throw new Error('Failed to deploy contract: ' + JSON.stringify(res));
  }
  const txid = (res as { txid: string }).txid;
  const contractId = `${DEPLOYER_ADDRESS}.${contractName}`;
  return { txid, contractId };
}

