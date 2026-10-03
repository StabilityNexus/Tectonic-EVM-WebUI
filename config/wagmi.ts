import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { classic, sepolia, hardhat, polygonAmoy, base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Tectonic-EVM-WebUI',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'c6c5ac93b740dd7e9bcbed9817de7220', // Fallback to public demo ID without localhost restrictions
  chains: [classic, base, sepolia, polygonAmoy, hardhat],
  ssr: true,
});
