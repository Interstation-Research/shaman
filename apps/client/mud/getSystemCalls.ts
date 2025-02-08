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
    metadata: string
  ): Promise<Hex> => {
    await tokenContract.simulate.approve(
      [worldContract.address, initialDeposit],
      {
        chain,
        account: account.address,
      }
    );

    const approveTx = await tokenContract.write.approve(
      [worldContract.address, initialDeposit],
      {
        chain,
        account: account.address,
      }
    );

    await waitForTransaction(approveTx);

    await worldContract.simulate.createShaman([initialDeposit, metadata], {
      account: account.address,
    });

    const hash = await worldContract.write.createShaman(
      [initialDeposit, metadata],
      {
        chain,
        account,
      }
    );

    const receipt = await waitForTransaction(hash);
    const logs = await worldContract.getEvents.ShamanCreated(receipt);
    return logs[0].topics[1] as Hex;
  };

  const updateShamanMetadata = async (shamanId: Hex, metadata: string) => {
    await worldContract.simulate.updateShamanMetadata([shamanId, metadata], {
      account: account.address,
    });

    const hash = await worldContract.write.updateShamanMetadata(
      [shamanId, metadata],
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
    const price = await getPrice(quantity);

    await tokenContract.simulate.buy([account.address, quantity], {
      chain,
      account: account.address,
      value: price,
    });

    const hash = await tokenContract.write.buy([account.address, quantity], {
      chain,
      account,
      value: price,
    });

    return waitForTransaction(hash);
  };

  const getPrice = async (amount: bigint): Promise<bigint> => {
    return (await tokenContract.read.getPrice([amount])) as bigint;
  };

  const getTokenSupply = async (): Promise<bigint> => {
    return (await tokenContract.read.totalSupply()) as bigint;
  };

  const getBalanceOf = async (address: Hex): Promise<bigint> => {
    return (await tokenContract.read.balanceOf([address])) as bigint;
  };

  const getTokenAddress = async (): Promise<Hex> => {
    return (await worldContract.read.getTokenAddress()) as Hex;
  };

  return {
    createShaman,
    updateShamanMetadata,
    cancelShaman,
    purchase,
    getBalanceOf,
    getPrice,
    getTokenAddress,
    getTokenSupply,
  };
}
