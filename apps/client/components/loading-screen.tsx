import { useAsciiText, alligator } from 'react-ascii-text';
import { LoadingProgress } from './loading-progress';

import { useMUD } from '@/contexts/mud-context';

export function LoadingScreen({ children }: { children: React.ReactNode }) {
  const mud = useMUD();
  const asciiTextRef = useAsciiText({
    font: alligator,
    text: 'Shaman',
  });

  if (mud) {
    return <LoadingProgress>{children}</LoadingProgress>;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="self-center">
          <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-sm">
            <pre
              className="w-full"
              ref={asciiTextRef as React.RefObject<HTMLPreElement>}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
