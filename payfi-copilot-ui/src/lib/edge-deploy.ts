// src/lib/edge-deploy.ts
import type { 
  TxBroadcastResult,
  TxBroadcastResultOk,
  TxBroadcastResultRejected,
  ContractDeployOptions,
  ClarityValue,
  ClarityType,
  ResponseOkCV,
  ResponseErrorCV,
  TupleCV,
  ListCV,
  BufferCV,
  IntCV,
  UIntCV,
  BooleanCV,
  PrincipalCV,
  ResponseCV,
  OptionalCV,
  StringAsciiCV,
  StringUtf8CV
} from '@stacks/transactions';

import { 
  makeContractDeploy,
  broadcastTransaction as stacksBroadcast,
  AnchorMode,
  bufferCVFromString,
  createStacksPrivateKey,
  standardPrincipalCV,
  stringAsciiCV,
  stringUtf8CV,
  uintCV,
  callReadOnlyFunction,
  cvToHex,
  cvToJSON,
  hexToCV,
  cvToValue,
  boolCV
} from '@stacks/transactions';

import { StacksTestnet, StacksMainnet, StacksNetwork } from '@stacks/network';

// Re-export types for backward compatibility
export type {
  ResponseOkCV,
  ResponseErrorCV,
  TupleCV,
  ListCV,
  BufferCV,
  IntCV,
  UIntCV,
  BooleanCV,
  PrincipalCV,
  ResponseCV,
  OptionalCV,
  StringAsciiCV,
  StringUtf8CV
};

const STACKS_NODE = (import.meta as Record<string, any>).env?.VITE_STACKS_NODE || 'http://localhost:3999';
const DEPLOYER_KEY = (import.meta as Record<string, any>).env?.VITE_DEPLOYER_KEY || '';
const DEPLOYER_ADDRESS = (import.meta as Record<string, any>).env?.VITE_DEPLOYER_ADDRESS || '';

function randomContractName() {
  return 'ai_' + Math.random().toString(36).slice(2, 10);
}

async function broadcastTransaction(tx: any, network: StacksNetwork): Promise<TxBroadcastResultOk> {
  try {
    const result = await stacksBroadcast(tx, network);
    if ('error' in result) {
      throw new Error(`Transaction rejected: ${(result as TxBroadcastResultRejected).reason}`);
    }
    return result as TxBroadcastResultOk;
  } catch (error) {
    throw new Error(`Failed to broadcast transaction: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function edgeDeploy(code: string, name?: string): Promise<{ txid: string; contractId: string }> {
  if (!DEPLOYER_KEY) throw new Error('VITE_DEPLOYER_KEY not set');
  if (!DEPLOYER_ADDRESS) throw new Error('VITE_DEPLOYER_ADDRESS not set');
  
  const contractName = name || randomContractName();
  const network = new StacksTestnet({ url: STACKS_NODE });
  
  const txOptions = {
    contractName,
    codeBody: code,
    senderKey: DEPLOYER_KEY,
    network,
    anchorMode: AnchorMode.Any,
    nonce: 0, // Will be set automatically if not provided
    fee: 10000, // Will be estimated if not provided
  };

  const transaction = await makeContractDeploy(txOptions);
  
  // Sign and broadcast the transaction
  const result = await stacksBroadcast(transaction, network);
  
  if ('error' in result) {
    throw new Error(`Transaction failed: ${result.reason}`);
  }
  
  const txid = result.txid;
  const contractId = `${DEPLOYER_ADDRESS}.${contractName}`;
  
  return { txid, contractId };
}

