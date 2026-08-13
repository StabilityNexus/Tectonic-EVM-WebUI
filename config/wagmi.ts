import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { classic, sepolia, hardhat, polygonAmoy, base } from 'wagmi/chains';

import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'Tectonic-EVM-WebUI',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'b56e18d47c72ab683b10814fe9495694', // Fallback to public demo ID without localhost restrictions
  chains: [classic, base, sepolia, polygonAmoy, hardhat],
  transports: {
    [classic.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
    [polygonAmoy.id]: http('https://polygon-amoy.drpc.org'),
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
  ssr: true,
});
