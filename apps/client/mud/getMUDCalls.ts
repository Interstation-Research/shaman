import { PublicClient, WalletClient } from 'viem';

import { getContracts } from '@/mud/getContracts';
import { MUDStateResult } from '@/mud/getMUDState';
import { getSystemCalls } from '@/mud/getSystemCalls';

export type MUDCallsResult = Awaited<ReturnType<typeof getMUDCalls>>;

export async function getMUDCalls(
  mudState: MUDStateResult,
  publicClient: PublicClient,
  walletClient: WalletClient
) {
  const contracts = await getContracts(publicClient, walletClient);
  const systemCalls = getSystemCalls({ ...mudState, ...contracts });

  return {
    ...contracts,
    systemCalls,
  };
}
