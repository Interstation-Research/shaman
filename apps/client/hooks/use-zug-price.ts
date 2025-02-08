import { useQuery } from '@tanstack/react-query';
import { useMUD } from '@/contexts/mud-context';

export const useZugPrice = (amount: bigint) => {
  const mud = useMUD();
  return useQuery({
    queryKey: ['zugPrice', Number(amount)],
    initialData: 0n,
    queryFn: () => {
      return mud?.calls.embedded?.systemCalls?.getPrice(amount);
    },
    enabled: !!mud?.calls?.embedded?.systemCalls,
  });
};
