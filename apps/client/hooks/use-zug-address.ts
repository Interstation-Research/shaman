import { useQuery } from '@tanstack/react-query';
import { useMUD } from '@/contexts/mud-context';

export const useZugAddress = () => {
  const mud = useMUD();
  return useQuery({
    queryKey: ['zugAddress'],
    initialData: '',
    queryFn: () => {
      return mud?.calls.embedded?.systemCalls?.getTokenAddress();
    },
    enabled: !!mud?.calls?.embedded?.systemCalls,
  });
};
