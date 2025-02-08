import { Account, Chain, Hex, WalletClient } from 'viem';

import { GetContractsResult } from '@/mud/getContracts';
import { MUDStateResult } from '@/mud/getMUDState';

export type SystemCalls = ReturnType<typeof getSystemCalls>;

export function getSystemCalls({
  worldContract,
  tokenContract,
  networkConfig,
  waitForTransaction,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  client: { wallet: walletClient = {} as WalletClient, public: publicClient },
}: GetContractsResult & MUDStateResult) {
  const chain = networkConfig.chain as Chain;
  const account = walletClient.account as Account;

  // shaman functions
  const createShaman = async (
    initialDeposit: bigint,
    metadataURI: string
  ): Promise<Hex> => {
    await worldContract.simulate.createShaman([initialDeposit, metadataURI], {
      account: account.address,
    });

    const hash = await worldContract.write.createShaman(
      [initialDeposit, metadataURI],
      {
        chain,
        account,
      }
    );

    const receipt = await waitForTransaction(hash);
    const logs = await worldContract.getEvents.ShamanCreated(receipt);
    return logs[0].topics[1] as Hex;
  };

  const updateShamanMetadata = async (shamanId: Hex, metadataURI: string) => {
    await worldContract.simulate.updateShamanMetadata([shamanId, metadataURI], {
      account: account.address,
    });

    const hash = await worldContract.write.updateShamanMetadata(
      [shamanId, metadataURI],
      {
        chain,
        account,
      }
    );

    return waitForTransaction(hash);
  };

  const cancelShaman = async (shamanId: Hex) => {
    await worldContract.simulate.cancelShaman([shamanId], {
      account: account.address,
    });

    const hash = await worldContract.write.cancelShaman([shamanId], {
      chain,
      account,
    });

    return waitForTransaction(hash);
  };

  const purchase = async (quantity: bigint) => {
    await tokenContract.simulate.buy([account.address, quantity], {
      account: account.address,
    });

    const hash = await tokenContract.write.buy([account.address, quantity], {
      chain,
      account,
    });

    return waitForTransaction(hash);
  };

  const getBalanceOf = async (address: Hex): Promise<bigint> => {
    return (await tokenContract.read.balanceOf([address])) as bigint;
  };

  return {
    createShaman,
    updateShamanMetadata,
    cancelShaman,
    purchase,
    getBalanceOf,
  };
}
