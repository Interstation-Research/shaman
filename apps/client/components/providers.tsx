'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrivyProvider } from '@privy-io/react-auth';
import { createConfig } from '@privy-io/wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { WagmiProvider } from '@privy-io/wagmi';
import { http } from 'wagmi';
import { ThemeProvider } from 'next-themes';
import { LoadingScreen } from './loading-screen';
import { MUDProvider } from '@/contexts/mud-context';
import { DialogContextProvider } from '@/contexts/dialog-context';

const queryClient = new QueryClient();

const config = createConfig({
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: 'dark',
        },
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
        defaultChain: arbitrumSepolia,
      }}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <MUDProvider>
            <ThemeProvider attribute="class" defaultTheme="dark">
              <DialogContextProvider>
                <LoadingScreen>{children}</LoadingScreen>
              </DialogContextProvider>
            </ThemeProvider>
          </MUDProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
