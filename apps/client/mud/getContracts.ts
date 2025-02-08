import { Hex, getContract, PublicClient, WalletClient } from 'viem';

import { IWorld } from 'contracts/abis/IWorld.abi';
import { ZugToken } from 'contracts/abis/ZugToken.abi';
import { getNetworkConfig } from '@/mud/getNetworkConfig';

export type GetContractsResult = Awaited<ReturnType<typeof getContracts>>;

export async function getContracts(
  publicClient: PublicClient,
  walletClient: WalletClient
) {
  const networkConfig = getNetworkConfig();
  const worldContract = getContract({
    address: networkConfig.worldAddress as Hex,
    abi: IWorld,
    client: {
      public: publicClient,
      wallet: walletClient,
    },
  });

  const tokenContract = getContract({
    address: (await worldContract.read.getTokenAddress()) as Hex,
    abi: ZugToken,
    client: {
      public: publicClient,
      wallet: walletClient,
    },
  });

  return {
    client: {
      public: publicClient,
      wallet: walletClient,
    },
    worldContract,
    tokenContract,
  };
}
