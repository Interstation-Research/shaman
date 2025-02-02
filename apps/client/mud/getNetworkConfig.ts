import worlds from 'contracts/worlds.json';

import { chainId, chain } from '@/mud/supportedChains';
export function getNetworkConfig() {
  const world = worlds[
    chainId.toString() as keyof typeof worlds
  ] as unknown as {
    address?: string;
    blockNumber?: bigint;
  };
  const worldAddress = world?.address;
  if (!worldAddress) {
    throw new Error(
      `No world address found for chain ${chainId}. Did you run \`mud deploy\`?`
    );
  }

  /*
   * MUD clients use events to synchronize the database, meaning
   * they need to look as far back as when the World was started.
   * The block number for the World start can be specified either
   * on the URL (as initialBlockNumber) or in the worlds.json
   * file. If neither has it, it starts at the first block, zero.
   */
  const initialBlockNumber = world?.blockNumber ?? 0n;

  return {
    chainId,
    chain,
    worldAddress,
    initialBlockNumber,
  };
}
