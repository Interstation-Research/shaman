import { Hex, getContract, PublicClient, WalletClient } from 'viem';

import IWorldAbi from 'contracts/abis/IWorld.abi.json';
import ZugTokenAbi from 'contracts/abis/ZugToken.abi.json';
import { getNetworkConfig } from '@/mud/getNetworkConfig';

export type GetContractsResult = Awaited<ReturnType<typeof getContracts>>;

export async function getContracts(
  publicClient: PublicClient,
  walletClient: WalletClient
) {
  const networkConfig = getNetworkConfig();
  const worldContract = getContract({
    address: networkConfig.worldAddress as Hex,
    abi: IWorldAbi,
    client: {
      public: publicClient,
      wallet: walletClient,
    },
  });

  const tokenContract = getContract({
    address: (await worldContract.read.getTokenAddress()) as Hex,
    abi: ZugTokenAbi,
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
