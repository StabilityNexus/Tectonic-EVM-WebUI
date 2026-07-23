import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Tectonic-EVM-WebUI',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'c4a4f8d9b1dbbb3d5006b9ef2db5c4a7', // Fallback to public demo ID without localhost restrictions
  chains: [mainnet, sepolia, hardhat],
  ssr: true,
});
