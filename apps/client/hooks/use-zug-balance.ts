import { Hex } from 'viem';

import { useQuery } from '@tanstack/react-query';
import { useMUD } from '@/contexts/mud-context';

export const useZugBalance = (walletAddress?: Hex) => {
  const mud = useMUD();
  return useQuery({
    queryKey: ['zugBalance', walletAddress],
    initialData: 0n,
    queryFn: () => {
      if (!walletAddress) return null;
      return mud?.calls.embedded?.systemCalls?.getBalanceOf(walletAddress);
    },
    enabled: !!walletAddress && !!mud?.calls?.embedded?.systemCalls,
  });
};
