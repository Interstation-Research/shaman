import { createContext, ReactNode, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWalletClient } from 'wagmi';
import { useWallets } from '@privy-io/react-auth';
import {
  Chain,
  createPublicClient,
  createWalletClient,
  custom,
  fallback,
  Hex,
  http,
  PublicClient,
  WalletClient,
} from 'viem';
import { getMUDCalls, MUDCallsResult } from '@/mud/getMUDCalls';
import { getMUDState, MUDStateResult } from '@/mud/getMUDState';
import { chain } from '@/mud/supportedChains';

if (!chain) throw new Error('Chain is not set');

export type MUDContextResult = MUDStateResult & {
  calls: {
    active?: Partial<MUDCallsResult>;
    embedded?: Partial<MUDCallsResult>;
  };
};

export const publicClient: PublicClient = createPublicClient({
  chain: chain as Chain,
  batch: {
    multicall: true,
  },
  transport: fallback(
    [
      http((chain as Chain)?.rpcUrls?.alchemy?.http[0], {
        batch: true,
      }),
      http((chain as Chain)?.rpcUrls?.quicknode?.http[0], {
        batch: true,
      }),
    ],
    { rank: true }
  ),
});

const MUDContext = createContext<MUDContextResult | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const MUDProvider = ({ children }: Props) => {
  const activeWalletClient = useWalletClient();
  const { wallets } = useWallets();

  const { data: walletClients } = useQuery({
    queryKey: ['walletClients', wallets.length],
    queryFn: async () => {
      return Promise.all(
        wallets.map(async (wallet) =>
          createWalletClient({
            name: wallet.walletClientType,
            account: wallet.address as Hex,
            transport: custom(await wallet.getEthereumProvider()),
          })
        )
      );
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const { data: mudState } = useQuery({
    queryKey: ['mudState'],
    queryFn: async () => {
      const response = await getMUDState(publicClient);
      return response;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const { data: mudCalls } = useQuery({
    queryKey: [
      'mudCalls',
      activeWalletClient.dataUpdatedAt,
      walletClients?.length,
    ],
    queryFn: async () => {
      if (!mudState) return;

      const activeMudCalls = await getMUDCalls(
        mudState,
        publicClient,
        activeWalletClient.data as WalletClient
      );

      const walletsMudCalls = await Promise.all(
        (walletClients || []).map((client) =>
          getMUDCalls(mudState, publicClient, client)
        )
      );

      const walletMap = walletsMudCalls.reduce(
        (acc, mudCalls) => ({
          ...acc,
          [mudCalls.client.wallet.name]: mudCalls,
        }),
        {} as Record<string, MUDCallsResult>
      );

      return {
        active: activeMudCalls || walletsMudCalls[0],
        embedded: walletMap['privy'] || activeMudCalls,
      };
    },
    enabled: !!mudState,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return (
    <MUDContext.Provider
      value={
        mudState
          ? {
              ...mudState,
              calls: {
                ...mudCalls,
              },
            }
          : undefined
      }>
      {children}
    </MUDContext.Provider>
  );
};

export const useMUD = () => {
  return useContext(MUDContext);
};
