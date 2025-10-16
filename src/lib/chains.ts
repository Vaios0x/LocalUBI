import { celo, celoAlfajores } from 'viem/chains';

export const supportedChains = [celo, celoAlfajores];
export const defaultChain = celo;

export const chainConfig = {
  [celo.id]: {
    name: 'Celo',
    rpcUrl: 'https://forno.celo.org',
    blockExplorer: 'https://celoscan.io',
    nativeCurrency: {
      name: 'CELO',
      symbol: 'CELO',
      decimals: 18,
    },
  },
  [celoAlfajores.id]: {
    name: 'Celo Alfajores',
    rpcUrl: 'https://alfajores-forno.celo-testnet.org',
    blockExplorer: 'https://alfajores.celoscan.io',
    nativeCurrency: {
      name: 'CELO',
      symbol: 'CELO',
      decimals: 18,
    },
  },
};
