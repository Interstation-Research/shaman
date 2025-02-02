import mudConfig from 'contracts/mud.config';
import { syncToRecs } from '@latticexyz/store-sync/recs';
import { Hex, PublicClient } from 'viem';

import { world } from './world';

import { getNetworkConfig } from '@/mud/getNetworkConfig';

export type MUDStateResult = Awaited<ReturnType<typeof getMUDState>>;

export async function getMUDState(publicClient: PublicClient) {
  const networkConfig = getNetworkConfig();

  const { components, latestBlock$, storedBlockLogs$, waitForTransaction } =
    await syncToRecs({
      world,
      config: mudConfig,
      address: networkConfig.worldAddress as Hex,
      publicClient,
      startBlock: BigInt(networkConfig.initialBlockNumber),
      // indexerUrl: 'https://api.indexer'
    });

  return {
    components,
    publicClient,
    latestBlock$,
    networkConfig,
    storedBlockLogs$,
    waitForTransaction,
  };
}
