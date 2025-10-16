'use client';
import { ReactNode } from 'react';
import { celo } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';

const queryClient = new QueryClient();

// Wagmi config for Celo
const wagmiConfig = createConfig({
  chains: [celo],
  transports: {
    [celo.id]: http('https://forno.celo.org'),
  },
});

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}