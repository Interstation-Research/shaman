import { useQuery } from '@tanstack/react-query';
import { useMUD } from '@/contexts/mud-context';

export const useZugSaleSupply = () => {
  const mud = useMUD();
  return useQuery({
    queryKey: ['zugSaleSupply'],
    initialData: {
      totalSaleSupply: 0n,
      maxSaleSupply: 0n,
      currentSupply: 0n,
    },
    queryFn: async () => {
      const totalSaleSupply =
        await mud?.calls.embedded?.systemCalls?.getTotalSaleSupply();
      const maxSaleSupply =
        await mud?.calls.embedded?.systemCalls?.getMaxSaleSupply();
      const currentSupply = (maxSaleSupply || 0n) - (totalSaleSupply || 0n);

      return {
        totalSaleSupply,
        maxSaleSupply,
        currentSupply,
      };
    },
    enabled: !!mud?.calls?.embedded?.systemCalls,
  });
};
