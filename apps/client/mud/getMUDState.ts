import mudConfig from 'contracts/mud.config';
import { syncToRecs } from '@latticexyz/store-sync/recs';
import { Hex, PublicClient } from 'viem';

import { world } from './world';

import { getNetworkConfig } from '@/mud/getNetworkConfig';

export type MUDStateResult = Awaited<ReturnType<typeof getMUDState>>;

const indexerUrl = process.env.NEXT_PUBLIC_INDEXER_URL;

if (!indexerUrl) {
  throw new Error('NEXT_PUBLIC_INDEXER_URL is not defined');
}

export async function getMUDState(publicClient: PublicClient) {
  const networkConfig = getNetworkConfig();

  const { components, latestBlock$, storedBlockLogs$, waitForTransaction } =
    await syncToRecs({
      world,
      config: mudConfig,
      address: networkConfig.worldAddress as Hex,
      publicClient,
      startBlock: BigInt(networkConfig.initialBlockNumber),
      indexerUrl,
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
